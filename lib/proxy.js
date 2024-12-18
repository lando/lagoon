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
const getBasicContainers = services => {
  const basicContainers = _(services).filter(service => service.type === 'lagoon-basic').map('name').value();
  let basicPort = '';
  if (!_.isEmpty(basicContainers)) {
    basicPort = services[_.first(basicContainers)].lagoon.ports[0];
  }
  return [basicContainers, basicPort];
};

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
 * Helper to check if primary server config is defined
 */
const getConfig = services => {
  const primaryServerConfig = _(services).find(service => service.config !== '').config.services;
  const primaryServerSet = _(primaryServerConfig).find(service => service.primary === true);
  return !!primaryServerSet;
};

const primaryServerCheck = services => {
  const primaryServerConfig = _(services).find(service => service.config !== '').config.services;
  let count = 0;
  _.forEach(primaryServerConfig, service => {
    service.primary === true ? count++ : '';
  });
  if (count > 1) {
    throw new Error('Only one primary server can be set');
  }
  let primaryServer = '';
  Object.entries(primaryServerConfig).forEach(([key, value]) => {
    if (value.primary === true) {
      primaryServer = key;
    }
  });
  return primaryServer;
};

/*
 * Helper to set the Primary Server
 */
const setPrimaryServer = (services, domain, proxy) => {
  let primaryServer = '';
  switch (true) {
    case !_.isEmpty(getServingContainers(services)):
      primaryServer = getServingContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:8080`, `${domain}:8080`];
      break;
    case !_.isEmpty(getNodeContainers(services)):
      primaryServer = getNodeContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:3000`, `${domain}:3000`];
      break;
    case !_.isEmpty(getPythonContainers(services)):
      primaryServer = getPythonContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:8800`, `${domain}:8800`];
      break;
    case !_.isEmpty(getRubyContainers(services)):
      primaryServer = getRubyContainers(services).shift();
      proxy[primaryServer] = [`${primaryServer}.${domain}:3000`, `${domain}:3000`];
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
  const primaryServer = primaryServerCheck(services);
  const primaryServerConfig = _(services).find(service => service.name === primaryServer);
  const primaryServerPort = !_.isUndefined(primaryServerConfig.lagoon.ports)
    ? primaryServerConfig.lagoon.ports[0].includes(':')
      ? primaryServerConfig.lagoon.ports[0]?.split(':')[1]
      : primaryServerConfig.lagoon.ports[0]
    : services[primaryServer].lagoon.ports[0];

  proxy[primaryServer] = [`${domain}:${primaryServerPort}`, `${primaryServer}.${domain}:${primaryServerPort}`];
  // eslint-disable-next-line no-unused-vars
  const {[primaryServer]: removedProperty, ...parsedServices} = services;
  return parsedServices;
};

/*
 * Helper to map parsed platform config into related Lando things
 */
exports.getLandoProxyRoutes = (services, domain, proxy = {}) => {
  let parsedServices = {};
  if (!getConfig(services)) {
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

  // Collect the Basic serving containers
  const [basicContainer, basicContainerPort] = getBasicContainers(services);
  if (!_.isEmpty(basicContainer)) {
    _.forEach(basicContainer, service => {
      proxy[service] = [`${service}.${domain}:${basicContainerPort}`];
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

  // Add mailhog if it's there
  if (_.includes(_.keys(parsedServices), 'mailhog')) {
    proxy.mailhog = [`inbox.${domain}`];
  }

  // Return
  return proxy;
};
