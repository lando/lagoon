'use strict';

const _ = require('lodash');

// Lando removes Compose service contexts, so build their source images first.
const getDependencies = service => {
  const contexts = _.get(service, 'build.additional_contexts', {});
  return _.values(contexts).map(context => {
    const value = Array.isArray(contexts) ? context.slice(context.indexOf('=') + 1) : context;
    return typeof value === 'string' && value.startsWith('service:') ? value.slice(8) : null;
  }).filter(Boolean);
};

exports.getBuildDependencies = (services, targets = Object.keys(services)) => {
  const visiting = new Set();
  const visited = new Set();
  const dependencies = [];
  const visit = name => {
    if (visiting.has(name)) throw new Error(`Circular Lagoon build dependency: ${name}`);
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of getDependencies(services[name])) {
      if (!_.get(services, [dependency, 'build'])) {
        throw new Error(`Lagoon build dependency ${dependency} must have a local build`);
      }
      visit(dependency);
      if (!dependencies.includes(dependency)) dependencies.push(dependency);
    }
    visiting.delete(name);
    visited.add(name);
  };
  targets.forEach(visit);
  return dependencies;
};

exports.buildDependencies = async app => {
  const services = _.get(app, 'lagoon.config.compose.services', {});
  const supported = Object.keys(require('./services').getLandoServices(app.lagoon.services));
  const selected = _.get(app, 'opts.services', []);
  const targets = selected.length ? selected.filter(name => supported.includes(name)) : supported;
  const dependencies = exports.getBuildDependencies(services, targets);
  for (const service of dependencies) {
    if (!supported.includes(service)) throw new Error(`Unsupported Lagoon build dependency: ${service}`);
    await app.engine.build({
      project: app.project,
      compose: app.compose,
      opts: {services: [service], local: [service], pullable: []},
    });
  }
};
