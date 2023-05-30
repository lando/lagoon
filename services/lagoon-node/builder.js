'use strict';

// Modules
const _ = require('lodash');

// Builder
module.exports = {
  name: 'lagoon-node',
  config: {
    version: 'custom',
    confSrc: __dirname,
    command: '/sbin/tini -- /lagoon/entrypoints.sh yarn run start',
    port: '3000',
    moreHttpPorts: ['3000'],
  },
  parent: '_lagoon',
  builder: (parent, config) => class LandoLagoonNode extends parent {
    constructor(id, options = {}, factory) {
      options = _.merge({}, config, options);

      // Build node
      const node = {
        command: options.command,
      };

      // Add in the node service and push downstream
      super(id, options, {services: _.set({}, options.name, node)});
    };
  },
};
