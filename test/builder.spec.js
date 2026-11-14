'use strict';

const {expect} = require('chai');
const path = require('path');
const definition = require('../builders/_lagoon');

// Capture the actual compose sources passed to Lando without loading or starting Lando.
class Parent {
  constructor(id, options, ...sources) {
    this.options = options;
    this.sources = sources;
  }
}
const Builder = definition.builder(Parent);
const root = path.resolve('lagoon-test-project');
const buildService = lagoon => new Builder('nginx', {
  name: 'nginx',
  app: 'example',
  root,
  lagoon: {...lagoon, environment: {}},
  _app: {
    _config: {domain: 'lndo.site'},
    lagoon: {containers: ['nginx'], config: {lagoon: {project: 'example'}}},
  },
});

describe('Lagoon builder compose output', () => {
  for (const [label, context, expected] of [
    ['project root', '.', root],
    ['subdirectory', 'frontend', path.join(root, 'frontend')],
    ['parent directory', '../shared', path.resolve(root, '../shared')],
    ['absolute directory', path.resolve('shared'), path.resolve('shared')],
  ]) {
    it(`resolves the ${label} build context and preserves Dockerfile and CLI_IMAGE`, () => {
      const service = buildService({build: {context, dockerfile: 'docker/nginx.Dockerfile', args: {CLI_IMAGE: 'local-cli'}}});
      expect(service.sources[0].services.nginx.build).to.deep.equal({
        context: expected, dockerfile: 'docker/nginx.Dockerfile', args: {CLI_IMAGE: 'local-cli'},
      });
    });
  }

  it('does not invent a build for image-only services', () => {
    const service = buildService({image: 'uselagoon/nginx:latest'});
    expect(service.sources[0].services.nginx).not.to.have.property('build');
  });
});
