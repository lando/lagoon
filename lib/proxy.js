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
const getNodeContainers = services => _(services)
  .filter(service => service.type === 'lagoon-node')
  .map('name')
  .value();

/*
* Helper to set the primary server
*/
const setPrimaryServer = (services, domain, proxy) => {
  let primaryServer = '';
    if (!_.isEmpty(getServingContainers(services))) {
      primaryServer = _.first(getServingContainers(services));
      // @NOTE: can we assume nginx is always served from 8080?
      proxy[primaryServer] = [`${domain}:8080`];
    } else if (!_.isEmpty(getOtherServingContainers(services))) {
      primaryServer = _.first(getOtherServingContainers(services));
      proxy[primaryServer] = [`${domain}:8080`];
    } else if (!_.isEmpty(getNodeContainers(services))) {
      primaryServer = _.first(getNodeContainers(services));
      proxy[primaryServer] = [`${domain}:3000`];
    }
  return primaryServer;
};

/*
 * Helper to map parsed platform config into related Lando things
 */
exports.getLandoProxyRoutes = (services, domain, proxy = {}) => {
  // Set the primary serving container & add the primary domain to this if it exist
  setPrimaryServer(services, domain, proxy);

  // Collect any nginx serving containers
  const nginxServingContainers = getServingContainers(services);
  // If we have other serving containers then lets also set up a proxies for those
  if (!_.isEmpty(nginxServingContainers)) {
    _.forEach(nginxServingContainers, service => {
      proxy[service] = [`${service}.${domain}:8080`];
    });
  }

  // Collect any Varnish serving containers
  const otherServingContainers = getOtherServingContainers(services);
  // If we have other serving containers then lets also set up a proxies for those
  if (!_.isEmpty(otherServingContainers)) {
    _.forEach(otherServingContainers, service => {
      proxy[service] = [`${service}.${domain}:8080`];
    });
  }

   // Collect the Node serving containers
  const nodeContainer = getNodeContainers(services);
  if (!_.isEmpty(nodeContainer)) {
    _.forEach(nodeContainer, service => {
      proxy[service] = [`${service}.${domain}:3000`];
    });
  }

  // Add mailhog if its there
  if (_.includes(_.keys(services), 'mailhog')) {
    proxy.mailhog = [`inbox.${domain}`];
  }

  // Return
  return proxy;
};
