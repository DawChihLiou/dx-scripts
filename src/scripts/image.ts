import { existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
import sharp from 'sharp';

/**
 * Return a map to represent image directories and their image files.
 */
function getFileKv(paths: string[]): Map<string, string[]> {
  const kv = paths.reduce((map, path) => {
    const tokens = path.split('/');
    const dir = tokens.slice(0, tokens.length - 1).join('/');

    map.set(dir, [...(map.get(dir) ?? []), path]);
    return map;
  }, new Map<string, string[]>());

  return kv;
}

/**
 * Return the diff between two directories.
 */
function getOutSubDirectory(inDir: string, outDir: string): string {
  const inToken = inDir.split('/');
  const outToken = outDir.split('/');

  let forkPointer = 0;

  for (let i = 0; i < outToken.length; i += 1) {
    if (inToken[i] !== outToken[i]) {
      forkPointer = i;
      break;
    }
  }

  const subDir = inToken.slice(forkPointer).join('/');

  if (subDir.replace(/\//g, '') === inDir.replace(/\//g, '')) {
    return `optimized/${subDir}`;
  }

  return subDir;
}

/**
 * Using sharp to generate optimized images.
 *
 * https://github.com/lovell/sharp
 * https://sharp.pixelplumbing.com
 */
async function generateImages(
  paths: string[],
  options: Record<string, string | boolean>,
): Promise<void> {
  console.log('🌄 Generating optimized images...');

  const collection = getFileKv(paths);

  for await (const [dir, paths] of collection.entries()) {
    const subDir = getOutSubDirectory(dir, options.outdir as string);
    const outputDir = (options.outdir as string).endsWith('/')
      ? `${options.outdir}${subDir}`
      : `${options.outdir}/${subDir}`;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    for await (const path of paths) {
      const token = path.split('/');
      const filename = token[token.length - 1].replace(
        /\.(png|gif|avif|jpg|jpeg|webp)$/,
        '',
      );

      const workers = Object.keys(options)
        .filter((key) => typeof options[key] === 'boolean' && options[key])
        .map((ext) => async () => {
          if (ext === 'gif') {
            // animated WebP has advantages over GIF
            // https://developers.google.com/speed/webp/faq#why_should_i_use_animated_webp
            await sharp(path, { animated: true })
              .webp({ reductionEffort: 6 })
              .toFile(`${outputDir}/${filename}.webp`);
          } else {
            await sharp(path).webp().toFile(`${outputDir}/${filename}.${ext}`);
          }
        });

      const results = await Promise.allSettled(
        workers.map((worker) => worker()),
      );

      const rejected = results.filter((result) => result.status === 'rejected');

      if (rejected.length !== 0) {
        console.log(
          `🌄 ${chalk.red(
            '⨯',
          )} Failed to generate optimized image for "${path}". Skipping...`,
        );
      }
    }
  }

  console.log(
    `🌄 ${chalk.green('✔')} Optimized images are generated in "${
      options.outdir
    }" directory.`,
  );
}

/**
 * Generates optimized image files in given image formats and given directory.
 * Default generated image format is ".webp".
 */
async function run() {
  const program = new Command();

  program
    .argument('<paths...>', 'file paths or glob patterns')
    .option('-o, --outdir [outdir]', 'Output directory', '.')
    .option('--webp', 'To generate .webp files', true)
    .option('--avif', 'To generate .avif files', false)
    .option('--png', 'To generate .png files', false)
    .option('--jpg', 'To generate .jpg files', false)
    .option('--gif', 'To generate animated .webp files', false)
    .parse();

  const paths = program.args;
  const options = program.opts();

  await generateImages(paths, options);
}

run();
