'use strict';

// Modules
const _ = require('lodash');

/*
 * TODO: Refactor how serving containers are found
 */

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
const setPrimaryServer = services => {
  let nginxServers = getServingContainers(services);
  let varnishContainers = getOtherServingContainers(services);
  let nodeContainers = getNodeContainers(services);
  let primaryServer = '';
  if (!_.isEmpty(nginxServers)) {
    primaryServer = _.first(nginxServers);
  } else if (!_.isEmpty(varnishContainers)) {
    primaryServer = _.first(varnishContainers);
  } else if (!_.isEmpty(nodeContainers)) {
    primaryServer = _.first(nodeContainers);
  }
  return primaryServer;
};

/*
 * Helper to map parsed platform config into related Lando things
 */
exports.getLandoProxyRoutes = (services, domain, proxy = {}) => {
  let nginxServers = getServingContainers(services);
  // Set the primary serving container
  const primaryServer = setPrimaryServer(services);
   // Add the primary domain to this if it exists
  // @NOTE: can we assume nginx is always served from 8080?
  if (primaryServer == _.first(nginxServers)) {
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
