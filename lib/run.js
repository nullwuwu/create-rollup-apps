const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const yeoman = require('yeoman-environment');
const clipboardy = require('clipboardy');

const apps = fs
  .readdirSync(`${__dirname}/generators`)
  .filter((f) => !f.startsWith('.'))
  .map((f) => {
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
      value: f,
      short: f,
    };
  });

const main = async (gpath, { name = '', cwd = process.cwd(), args = {} }) => {
  if (name) {
    mkdirp.sync(name);
    cwd = path.join(cwd, name);
  }

  const Generator = require(gpath);
  const env = yeoman.createEnv([], { cwd });
  const generator = new Generator({
    name,
    env,
    resolved: require.resolve(gpath),
    args,
  });

  return generator.run(() => {
    if (name) {
      if (process.platform !== `linux` || process.env.DISPLAY) {
        clipboardy.writeSync(`cd ${name}`);
        console.log('📋 Copied to clipboard, just use Ctrl+V');
      }
    }
    console.log('✨ File Generate Done');
  });
};

const run = async (config) => {
  process.send && process.send({ type: 'prompt' });

  process.emit('message', { type: 'prompt' });

  let { type } = config;

  if (!type) {
    const answers = await inquirer.prompt([
      {
        name: 'type',
        message: 'Select the boilerplate type',
        type: 'list',
        choices: apps,
      },
    ]);
    type = answers.type;
  }

  try {
    return main(`./generators/${type}`, config);
  } catch (error) {
    console.error(chalk.red(`> Generate failed`), e);
    process.exit(1);
  }
};

module.exports = run;
