'use strict';

const {expect} = require('chai');
const {getBuildDependencies, buildDependencies} = require('../lib/build');

const service = contexts => ({
  labels: {'lando.type': 'php-cli'},
  build: {context: '.', additional_contexts: contexts},
});

describe('Lagoon local image dependencies', () => {
  for (const contexts of [{cli: 'service:cli'}, ['cli=service:cli']]) {
    it(`orders ${Array.isArray(contexts) ? 'list' : 'map'} contexts transitively and deduplicates shared images`, () => {
      const services = {
        nginx: service(contexts), php: service(contexts),
        cli: service({base: 'service:base'}), base: service({remote: 'docker-image://alpine:3'}),
      };
      expect(getBuildDependencies(services)).to.deep.equal(['base', 'cli']);
      expect(getBuildDependencies(services, ['base'])).to.deep.equal([]);
    });
  }

  it('rejects cycles and missing local builds before invoking Docker', () => {
    expect(() => getBuildDependencies({cli: service({self: 'service:cli'})})).to.throw('Circular');
    expect(() => getBuildDependencies({php: service({cli: 'service:cli'})})).to.throw('must have a local build');
  });

  it('awaits source builds without pulling local images or changing app options', async () => {
    const calls = [];
    const services = {php: service({cli: 'service:cli'}), cli: service({base: 'service:base'}), base: service({})};
    const {parseServices} = require('../lib/config');
    const opts = {services: ['php'], local: ['php'], pullable: ['db']};
    const app = {
      project: 'example', compose: ['generated.yml'], opts,
      lagoon: {config: {compose: {services}}, services: parseServices(services, {})},
      engine: {build: async data => {
        calls.push(data);
        await Promise.resolve();
        if (data.opts.services[0] === 'cli') expect(calls[0].opts.services).to.deep.equal(['base']);
      }},
    };
    await buildDependencies(app);
    expect(calls.map(call => call.opts.services)).to.deep.equal([['base'], ['cli']]);
    expect(calls[0]).to.deep.equal({
      project: 'example', compose: ['generated.yml'], opts: {services: ['base'], local: ['base'], pullable: []},
    });
    expect(app.opts).to.equal(opts);
    expect(app.opts).to.deep.equal({services: ['php'], local: ['php'], pullable: ['db']});
    app.engine.build = async () => {
      throw new Error('build failed');
    };
    try {
      await buildDependencies(app);
      throw new Error('expected rejection');
    } catch (error) {
      expect(error.message).to.equal('build failed');
    }
  });
});
