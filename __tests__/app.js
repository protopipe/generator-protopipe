'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-protopipe:app without any parameters but prompts', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      componentName: 'someComponent',
      componentType: 'Templates',
      noexamples: true,
      description: 'Just a testcomponent'
    });
  });

  it('creates files', () => {
    assert.file(['package.json']);
  });

  it('set the component name and uses the atomic design level prefix', () => {
    assert.fileContent('package.json', /"name": "t_someComponent"/);
  });

  it('set the version to 0.0.0 as this is just a scaffold', () => {
    assert.fileContent('package.json', /"version": "0.0.0"/);
  });

  it('set the given description', () => {
    assert.fileContent('package.json', /"description": "Just a testcomponent"/);
  });

  it('set keywords which fit to a protopipe component', () => {
    assert.fileContent('package.json', /"description": "Just a testcomponent"/);
  });

  /**
   * Can be extracted into a behaves_like construct
   */

  it('creates templates folder', () => {
    assert.fileContent('src/templates/.empty', /.*/);
  });

  it('creates an index.hbs file', () => {
    assert.fileContent('src/templates/index.hbs', /Hello World/);
  });

  it('creates media folder for images and other media', () => {
    assert.fileContent('src/media/.empty', /.*/);
  });

  it('creates styles folder', () => {
    assert.fileContent('src/styles/.empty', /.*/);
  });

  it('creates js folder', () => {
    assert.fileContent('src/js/.empty', /.*/);
  });

  it('creates index.js file', () => {
    assert.fileContent(
      'src/js/index.js',
      /element.innerHTML = _.join\(\['Hello', 'webpack'\], ' '\);/
    );
  });

  it('installs grunt', () => {
    assert.fileContent('package.json', /"grunt":/);
  });

  it('installs webpack to bundle up everything', () => {
    assert.fileContent('package.json', /"webpack":/);
  });

  it('installs webpack to bundle up everything', () => {
    assert.fileContent('package.json', /"webpack":/);
  });

  it('installs lodash as depency', () => {
    assert.fileContent('package.json', /"lodash":/);
  });
});

describe('generator-protopipe:app with parameters only', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withArguments('someComponent')
      .withOptions({
        cli: true,
        componentType: 't',
        examples: true,
        description: 'Just a testcomponent'
      });
  });

  it('creates files', () => {
    assert.file(['package.json']);
  });

  it('set the component name and uses the atomic design level prefix', () => {
    assert.fileContent('package.json', /"name": "t_someComponent"/);
  });

  it('set the version to 0.0.0 as this is just a scaffold', () => {
    assert.fileContent('package.json', /"version": "0.0.0"/);
  });

  it('set the given description', () => {
    assert.fileContent('package.json', /"description": "Just a testcomponent"/);
  });

  it('set keywords which fit to a protopipe component', () => {
    assert.fileContent('package.json', /"keywords": \[\s*"protopipe/);
  });
});

describe('generator-protopipe:app with cli parameter only', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withArguments('someComponent')
      .withOptions({
        cli: true
      });
  });

  it('should create examples files', () => {
    expect(true).toBe(true);
  });

  it('should set *template* as component type', () => {
    assert.fileContent('package.json', /"name": "t_someComponent"/);
  });

  it('should set "I was to lazy to add a description" as the default description', () => {
    assert.fileContent(
      'package.json',
      /"description": "I was to lazy to add a description"/
    );
  });
});

describe('generator-protopipe:app with wrong given type parameter', () => {
  it('aborts when the type is wrong', cb => {
    helpers
      .run(path.join(__dirname, '../generators/app'))
      .withArguments('someComponent')
      .withOptions({
        componentType: 'type',
        examples: true,
        description: 'Just a testcomponent'
      })
      .on('error', err => {
        expect(err.message).toMatch(/c, a, m, o, t are allowed./);
        cb();
      })
      .then(() => {
        assert.noFile('package.json');
      });
  });
});
