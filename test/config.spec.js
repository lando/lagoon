'use strict';

const {expect} = require('chai');
const _ = require('lodash');
const {parseServices} = require('../lib/config');
const {getLandoServices} = require('../lib/services');

describe('Lagoon compose service parsing', () => {
  for (const contexts of [{cli: 'service:cli'}, ['cli=service:cli']]) {
    it(`strips ${Array.isArray(contexts) ? 'list' : 'map'} additional_contexts without mutating the source`, () => {
      const services = {
        nginx: {
          labels: {'lando.type': 'nginx'},
          build: {context: 'frontend', dockerfile: 'Dockerfile', args: {CLI_IMAGE: 'local-cli'}, additional_contexts: contexts},
          environment: {APP_ENV: 'local'},
          volumes: ['.:/app'],
          volumes_from: ['cli'],
          networks: ['default'],
          user: '1000',
        },
      };
      const original = _.cloneDeep(services);
      const parsed = getLandoServices(parseServices(services, {services: {}}));
      expect(parsed.nginx.lagoon.build).to.deep.equal({
        context: 'frontend', dockerfile: 'Dockerfile', args: {CLI_IMAGE: 'local-cli'},
      });
      expect(parsed.nginx.lagoon.environment).to.deep.equal({APP_ENV: 'local'});
      for (const key of ['volumes', 'volumes_from', 'networks', 'user']) {
        expect(parsed.nginx.lagoon).not.to.have.property(key);
      }
      expect(services).to.deep.equal(original);
    });
  }

  it('preserves services without additional contexts, including image-only and shorthand builds', () => {
    const parsed = parseServices({
      cli: {labels: {'lando.type': 'php-cli'}, build: '.'},
      redis: {labels: {'lando.type': 'redis'}, image: 'uselagoon/redis:latest'},
    }, {});
    expect(parsed[0].compose.build).to.equal('.');
    expect(parsed[1].compose.image).to.equal('uselagoon/redis:latest');
    expect(parsed[1].compose).not.to.have.property('build');
  });
});
