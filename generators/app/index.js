'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
require('babel-polyfill'); // Needed because [].includes seems to be not existing in 2.15.11

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('componentName', { required: false });
    this.option('cli', { required: false });
    this.option('noexamples', { required: false });
    this.option('componentType', { type: String, required: false });
    this.option('description', { type: String, required: false });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the phenomenal ' + chalk.red('generator-protopipe') + ' generator!'
      )
    );

    var prompts = [];

    if (this.options.cli) {
      this.options.examples = this.options.examples || true;
      this.options.componentType = this.options.componentType || 't';
      this.options.description =
        this.options.description || 'I was to lazy to add a description';
    } else {
      if (!this.options.componentName) {
        prompts.push({
          type: 'input',
          name: 'componentName',
          message: 'What is the name of the Component?'
        });
      }

      if (!['c', 'a', 'm', 'o', 't'].includes(this.options.componentType)) {
        if (this.options.componentType === undefined) {
          prompts.push({
            type: 'list',
            name: 'componentType',
            message: 'What type of component should it be?',
            choices: ['CI', 'Atom', 'Molecule', 'Organism', 'Templates'],
            required: true
          });
        } else {
          this.env.error('As component type only: c, a, m, o, t are allowed.');
        }
      }

      if (!this.options.noexamples) {
        prompts.push({
          type: 'confirm',
          name: 'examples',
          message: 'Would you like to create examples files(css,js,handlebars)?',
          default: true
        });
      }

      if (!this.options.description) {
        prompts.push({
          type: 'input',
          name: 'description',
          message: 'A short description of the Component'
        });
      }
    }

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.type =
      this.options.componentType || this.props.componentType.substr(0, 1).toLowerCase();
    this.projectName =
      this.type + '_' + (this.options.componentName || this.props.componentName);
    this.createExamples = this.options.examples || this.props.examples || false;
    this.description = this.options.description || this.props.description;
    this.keywords = [
      'protopipe',
      'component',
      'atomic',
      'design',
      'atomic-design',
      'handlebars'
    ];

    const npmFile = {
      name: this.projectName,
      version: '0.0.0',
      description: this.description,
      keywords: this.keywords,
      scripts: {
        'start:dev': 'webpack-dev-server'
      },
      devDependencies: {
        yarn: '^1.3.2',
        grunt: '^1.0.1',
        webpack: '^3.10.0',
        'webpack-dev-server': '^2.11.0'
      },
      dependencies: {
        lodash: '^4.17.4'
      }
    };

    this.fs.write('./package.json', JSON.stringify(npmFile, null, 2));
    ['templates', 'styles', 'js', 'media'].forEach(folder => {
      this.fs.write(
        './src/' + folder + '/.empty',
        "simple git tracked file, because git can't track empty folders."
      );
    });

    this.fs.copyTpl(
      this.templatePath('index.hbs'),
      this.destinationPath('src/templates/index.hbs')
    );

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('src/js/index.js')
    );
  }

  install() {
    this.npmInstall(['grunt', 'yarn' /* Not published yet, 'protopipe-toolchain' */], {
      'save-dev': true
    });
  }
};
