const Generator = require('yeoman-generator');
const { statSync } = require('fs');
const { basename } = require('path');
const glob = require('glob');

const noop = () => true;

module.exports = class extends Generator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.name = basename(opts.env.cwd);
  }

  isTsFile(f) {
    return f.endsWith('.ts') || f.endsWith('.tsx') || !!/(tsconfig\.json)/g.test(f);
  }

  prompt(questions) {
    process.send && process.send({ type: 'prompt' });
    process.emit('message', { type: 'prompt' });
    return super.prompt(questions);
  }

  writeFiles({ context, filterFiles = noop }) {
    glob
      .sync('**/*', {
        cwd: this.templatePath(),
        dot: true,
      })
      .filter(filterFiles)
      .forEach((file) => {
        const filePath = this.templatePath(file);
        if (statSync(filePath).isFile()) {
          this.fs.copyTpl(
            this.templatePath(filePath),
            this.destinationPath(file.replace(/^\$/, '.')),
            context,
          );
        }
      });
  }
};
