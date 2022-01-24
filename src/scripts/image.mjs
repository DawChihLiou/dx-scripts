import spawn from 'cross-spawn';
import chalk from 'chalk';
import { Command } from 'commander';

const format = {
  webp: 'webp',
  avif: 'avif',
  png: 'oxipng',
  jpg: 'mozjpeg',
};

/**
 * Return a map to represent image directories and their image files.
 * @param paths {string[]}
 * @return {Map<string, string[]>}
 */
function getFileTree(paths) {
  const tree = paths.reduce((map, path) => {
    const tokens = path.split('/');
    const dir = tokens.slice(0, tokens.length - 1).join('/');

    if (!map.has(dir)) {
      map.set(dir, []);
    }
    map.set(dir, [...map.get(dir), path]);
    return map;
  }, new Map());

  return tree;
}

/**
 * Output image formats
 *
 * @param options {Record<string, string | boolean}
 * @return {string[]}
 */
function getOutputFormats(options) {
  const formats = Object.keys(options)
    .filter((key) => key !== 'outdir')
    .filter((key) => options[key])
    .map((key) => `--${format[key]}=auto`);

  return formats;
}

/**
 * Generates optimized image files in given image formats and given directory.
 */
async function run() {
  const program = new Command();

  program
    .argument('<glob...>', 'file paths or glob patterns')
    .option('-o, --outdir [outdir]', 'Output directory', '.')
    .option('--webp', 'Use WebP to generate a .webp file', true)
    .option('--avif', 'Use AVIF to generate a .avif file', false)
    .option('--png', 'Use OxiPNG to generate a .png file', false)
    .option('--jpg', 'Use MozJPEG to generate a .jpg file', false)
    .parse();

  const paths = program.args;
  const options = program.opts();

  const collection = getFileTree(paths);
  const formats = getOutputFormats(options);

  console.log('🌄 Generating optimized images...');

  for (const [dir, paths] of collection.entries()) {
    const suffix = dir.replace(/\//g, '-');

    const result = spawn.sync(
      'npx',
      [
        'squoosh-cli',
        ...paths,
        `--output-dir=${options.outdir}`,
        `--suffix=_${suffix}`,
        ...formats,
      ],
      { stdio: 'inherit' },
    );

    if (result.status !== 0) {
      console.log(`🌄 Failed to optimize images in "${dir}". Skipping...`);
    }
  }

  console.log(
    `🌄 ${chalk.green(
      '✔',
    )} Optimized images are generated in ${'public/images/optimized'} directory.`,
  );
}

run();
