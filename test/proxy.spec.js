'use strict';

const {expect} = require('chai');
const _ = require('lodash');
const {parseServices} = require('../lib/config');
const {getLandoServices} = require('../lib/services');
const {getLandoProxyRoutes} = require('../lib/proxy');

const getRoutes = (definitions, overrides = {}) => {
  const compose = _.mapValues(definitions, ([type, port]) => ({labels: {'lando.type': type}, ports: [port]}));
  const services = getLandoServices(parseServices(compose, {services: overrides}));
  return getLandoProxyRoutes(services, 'example.lndo.site');
};

describe('Lagoon proxy container ports', () => {
  for (const port of ['3000', '3003:3000', 3000]) {
    it(`routes a basic service to its container port for ${JSON.stringify(port)}`, () => {
      expect(getRoutes({basic: ['basic', port]}).basic).to.deep.equal(['basic.example.lndo.site:3000']);
    });
  }

  for (const port of ['3011:3000', 3000]) {
    it(`routes an explicit primary server for ${JSON.stringify(port)}`, () => {
      expect(getRoutes({node: ['node', port]}, {node: {primary: true}}).node).to.deep.equal([
        'example.lndo.site:3000', 'node.example.lndo.site:3000',
      ]);
    });
  }

  it('uses each basic service container port instead of reusing the first one', () => {
    const routes = getRoutes({first: ['basic', '3003:3000'], second: ['basic', '8081:8080']});
    expect(routes.first).to.deep.equal(['first.example.lndo.site:3000']);
    expect(routes.second).to.deep.equal(['second.example.lndo.site:8080']);
  });

  it('keeps the root-domain route when a basic service is the explicit primary', () => {
    const routes = getRoutes({basic: ['basic', '3003:3000']}, {basic: {primary: true}});
    expect(routes.basic).to.deep.equal(['example.lndo.site:3000', 'basic.example.lndo.site:3000']);
  });

  it('retains the default nginx primary and routes other service types', () => {
    const routes = getRoutes({nginx: ['nginx', '8080'], node: ['node', '3011:3000'], python: ['python', '8811:8800']});
    expect(routes.nginx).to.deep.equal(['nginx.example.lndo.site:8080', 'example.lndo.site:8080']);
    expect(routes.node).to.deep.equal(['node.example.lndo.site:3000']);
    expect(routes.python).to.deep.equal(['python.example.lndo.site:8800']);
  });

  it('rejects multiple primary servers', () => {
    expect(() => getRoutes({node: ['node', '3000'], python: ['python', '8800']}, {
      node: {primary: true}, python: {primary: true},
    })).to.throw('Only one primary server can be set');
  });
});
