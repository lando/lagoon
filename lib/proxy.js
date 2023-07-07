'use strict';

// Modules
const _ = require('lodash');

/*
 * Helper to find containers that serve
 */
const getServingContainers = services => _(services)
  .filter(service => service.type === 'lagoon-nginx')
  .map('name')
  .value();

/*
 * Helper to find containers that serve
 */
const getOtherServingContainers = services => _(services)
  .filter(service => service.type === 'lagoon-varnish')
  .map('name')
  .value();

/*
 * Helper to find containers that serve
 */
const getPythonContainers = services => _(services)
  .filter(service => service.type === 'lagoon-python')
  .map('name')
  .value();

/*
 * Helper to find containers that serve
 */
const getRubyContainers = services => _(services)
  .filter(service => service.type === 'lagoon-ruby')
  .map('name')
  .value();

/*
 * Helper to find containers that serve
 */
const getNodeContainers = services => _(services)
  .filter(service => service.type === 'lagoon-node')
  .map('name')
  .value();

/*
 * Helper to set the Primary Server
 */
const setPrimaryServer = (services, domain, proxy) => {
  let primaryServer = '';
  switch (true) {
    case !_.isEmpty(getServingContainers(services)):
      primaryServer = getServingContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:8080`];
      break;
    case !_.isEmpty(getNodeContainers(services)):
      primaryServer = getNodeContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:3000`];
      break;
    case !_.isEmpty(getPythonContainers(services)):
      primaryServer = getPythonContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:8800`];
      break;
    case !_.isEmpty(getRubyContainers(services)):
      primaryServer = getRubyContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:3000`];
      break;
  }
  // eslint-disable-next-line no-unused-vars
  const {[primaryServer]: removedProperty, ...parsedServices} = services;
  return parsedServices;
};

/*
 * Helper to get the Primary Server if set
 */
const getPrimaryServer = (services, domain, proxy) => {
  const primaryServerConfig = _(services).find(service => service.config != '');
  const primaryServer = primaryServerConfig.config.primaryServer;
  const primaryServerPort = primaryServerConfig.lagoon.ports[0].includes(':')
  ? primaryServerConfig.lagoon.ports[0]?.split(':')[1]
  : primaryServerConfig.lagoon.ports[0];
  if (_.isNil(primaryServerConfig.config.primaryServer)) {
    return;
  }

  proxy[primaryServer] = [`${primaryServer}.${domain}:${primaryServerPort}`];
  // eslint-disable-next-line no-unused-vars
  const {[primaryServer]: removedProperty, ...parsedServices} = services;
  return parsedServices;
};

/*
 * Helper to map parsed platform config into related Lando things
 */
exports.getLandoProxyRoutes = (services, domain, proxy = {}) => {
  let parsedServices = {};
  if (_.isNil(getPrimaryServer(services, domain, proxy))) {
    parsedServices = setPrimaryServer(services, domain, proxy);
  } else {
    parsedServices = getPrimaryServer(services, domain, proxy);
  }

  // Collect any nginx serving containers
  const nginxServingContainers = getServingContainers(parsedServices);
  // If we have other serving containers then lets also set up a proxies for those
  if (!_.isEmpty(nginxServingContainers)) {
    _.forEach(nginxServingContainers, service => {
      proxy[service] = [`${service}.${domain}:8080`];
    });
  }

  // Collect any Varnish serving containers
  const otherServingContainers = getOtherServingContainers(parsedServices);
  // If we have other serving containers then lets also set up a proxies for those
  if (!_.isEmpty(otherServingContainers)) {
    _.forEach(otherServingContainers, service => {
      proxy[service] = [`${service}.${domain}:8080`];
    });
  }

   // Collect the Node serving containers
  const nodeContainer = getNodeContainers(parsedServices);
  if (!_.isEmpty(nodeContainer)) {
    _.forEach(nodeContainer, service => {
      proxy[service] = [`${service}.${domain}:3000`];
    });
  }

  // Collect the Python serving containers
  const pythonContainer = getPythonContainers(parsedServices);
  if (!_.isEmpty(pythonContainer)) {
    _.forEach(pythonContainer, service => {
      proxy[service] = [`${service}.${domain}:8800`];
    });
  }

  // Collect the Ruby serving containers
  const rubyContainer = getRubyContainers(parsedServices);
  if (!_.isEmpty(rubyContainer)) {
    _.forEach(rubyContainer, service => {
      proxy[service] = [`${service}.${domain}:3000`];
    });
  }

  // Add mailhog if its there
  if (_.includes(_.keys(parsedServices), 'mailhog')) {
    proxy.mailhog = [`inbox.${domain}`];
  }

  // Return
  return proxy;
};
