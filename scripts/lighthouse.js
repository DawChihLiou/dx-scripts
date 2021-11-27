'use strict';

process.on('unhandledRejection', (err) => {
  throw err;
});

const chalk = require('chalk');
const spawn = require('cross-spawn');
const lighthouse = require.resolve('lighthouse/lighthouse-cli');
const {
  computeMedianRun,
} = require('lighthouse/lighthouse-core/lib/median-run.js');

(async () => {
  const urls = process.argv.slice(2);

  const medians = urls.map((url) => {
    console.log(`🗼 Running Lighthouse for ${url}`);

    const results = [];

    for (let i = 0; i < 5; i++) {
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

  medians.forEach((median) => {
    console.log('\n ✅ Report is ready for', median.finalUrl);
    console.log(
      '🗼 Median performance score: ',
      draw(
        median.categories.performance.score,
        median.categories.performance.score * 100,
      ),
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
      console.log(`🗼 Median ${title}: ${draw(score, displayValue)}`);
    });
  });
})();

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
    return chalk.green(value);
  }
  if (score >= 0.5 && score < 0.9) {
    return chalk.yellow(value);
  }
  return chalk.red(value);
}
