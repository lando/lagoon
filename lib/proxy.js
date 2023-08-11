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
  const basicPort = services[_.first(basicContainers)].lagoon.ports[0];
  return [basicContainers, basicPort];
};

/*
 * Helper to find containers that serve
 */
const getNodeContainers = services => _(services)
  .filter(service => service.type === 'lagoon-node')
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
const getPythonContainers = services => _(services)
  .filter(service => service.type === 'lagoon-python')
  .map('name')
  .value();

/*
 * Helper to map parsed platform config into related Lando things
 */
exports.getLandoProxyRoutes = (services, domain, proxy = {}) => {
  // Find the primary serving container
  const nginxServers = getServingContainers(services);
  const primaryServer = _.first(nginxServers);
  // Add the primary domain to this if it exists
  // @NOTE: can we assume nginx is always served from 8080?
  if (primaryServer) {
    proxy[primaryServer] = [`${domain}:8080`];
    nginxServers.shift();
  }

  // Collect the other serving containers
  const otherServingContainers = getOtherServingContainers(services);
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
  const nodeContainer = getNodeContainers(services);
  if (!_.isEmpty(nodeContainer)) {
    _.forEach(nodeContainer, service => {
      proxy[service] = [`${service}.${domain}:3000`];
    });
  }

  const rubyContainer = getRubyContainers(services);
  if (!_.isEmpty(rubyContainer)) {
    _.forEach(rubyContainer, service => {
      proxy[service] = [`${service}.${domain}:3000`];
    });
  }

  // Collect the Python serving containers
  const pythonContainer = getPythonContainers(services);
  if (!_.isEmpty(pythonContainer)) {
    _.forEach(pythonContainer, service => {
      proxy[service] = [`${service}.${domain}:8800`];
    });
  }

  // Add mailhog if its there
  if (_.includes(_.keys(services), 'mailhog')) {
    proxy.mailhog = [`inbox.${domain}`];
  }

  // Return
  return proxy;
};
