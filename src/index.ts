#!/usr/bin/env node

import spawn from 'cross-spawn';
import chalk from 'chalk';

process.on('unhandledRejection', (err) => {
  throw err;
});

const args = process.argv.slice(2);
const scriptIndex = args.findIndex((arg) => arg === 'lighthouse');
const script = scriptIndex > 0 ? args[scriptIndex] : args[0];
const spawnArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['lighthouse'].includes(script)) {
  console.log(`
*************************************
*                                   *
*  🎉🎉 Welcome to ${chalk.bgMagenta.bold('dx-scripts')} 🎉🎉  *
*                                   *
*************************************
  `);

  const result = spawn.sync(
    process.execPath,
    spawnArgs
      .concat(require.resolve(`./scripts/${script}`))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' },
  );

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log('The script failed becuse the process exited too early.');
    } else if (result.signal === 'SIGTERM') {
      console.log('The script failed because the process is killed.');
    }
  }

  process.exit(result.status ?? undefined);
} else {
  console.log(`Unknown script "${script}".`);
}
