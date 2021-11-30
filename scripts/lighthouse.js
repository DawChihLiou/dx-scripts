'use strict';

process.on('unhandledRejection', (err) => {
  throw err;
});

const chalk = require('chalk');
const spawn = require('cross-spawn');
const { program } = require('commander');
const lighthouse = require.resolve('lighthouse/lighthouse-cli');
const {
  computeMedianRun,
} = require('lighthouse/lighthouse-core/lib/median-run.js');

/**
 * Color Lighthouse display value based on score.
 *
 * - 0 to 49 (red): Poor
 * - 50 to 89 (orange): Needs Improvement
 * - 90 to 100 (green): Good
 *
 * See more: https://web.dev/performance-scoring/#color-coding
 *
 * @param {number} score
 * @param {string} value
 */
function draw(score, value) {
  if (score >= 0.9 && score <= 1) {
    return chalk.green(`${value} (Good)`);
  }
  if (score >= 0.5 && score < 0.9) {
    return chalk.yellow(`${value} (Needs Improvement)`);
  }
  return chalk.red(`${value} (Poor)`);
}
/**
 * Run Lighthouse performance analysis in headless Chrome on given URLs and
 * compute the median.
 *
 * Lighthouse recommended to run the analyses in separate processes so that they
 * don't interfere with each other.
 */
async function run() {
  program
    .argument('<urls...>', 'Lighthouse will run the analysis on the URLs.')
    .option(
      '-i, --iteration <type>',
      'How many times Lighthouse should run the analysis per URL',
      5,
    )
    .parse();

  const urls = program.args;
  const options = program.opts();

  // collect the median of the analyses for each url
  const medians = urls.map((url) => {
    console.log(
      `🗼 Running Lighthouse for ${url}. It will take a while, please wait...`,
    );

    const results = [];
    const iterations = parseInt(options.iteration);

    // run lighthouse multiple times given by the user input and comput the median
    for (let i = 0; i < iterations; i++) {
      const { status, stdout } = spawn.sync('node', [
        lighthouse,
        url,
        '--output=json',
        '--chromeFlags=--headless',
        '--only-categories=performance',
      ]);

      if (status !== 0) {
        console.log('🗼 Lighthouse failed, skipping...');
        continue;
      }
      results.push(JSON.parse(stdout));
    }

    return computeMedianRun(results);
  });

  // collect the report for the computed median for each url
  const reports = medians.map((median) => {
    const report = [];

    report.push(`\n✅ Report is ready for ${median.finalUrl}`);
    report.push(
      `🗼 Median performance score: ${draw(
        median.categories.performance.score,
        median.categories.performance.score * 100,
      )}`,
    );

    [
      'first-contentful-paint',
      'interactive',
      'speed-index',
      'total-blocking-time',
      'largest-contentful-paint',
      'cumulative-layout-shift',
    ].map((matrix) => {
      const { title, displayValue, score } = median.audits[matrix];
      report.push(`🗼 Median ${title}: ${draw(score, displayValue)}`);
    });

    return report.join('\n');
  });

  // log the final output
  console.log(reports.join('\n'));
}

run();
