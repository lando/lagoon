'use strict';

// Modules
const _ = require('lodash');

// Builder
module.exports = {
  name: 'lagoon-python',
  config: {
    version: 'custom',
    confSrc: __dirname,
    command: 'python',
    port: '8800',
    moreHttpPorts: [],
  },
  parent: '_lagoon',
  builder: (parent, config) => class LandoLagoonPython extends parent {
    constructor(id, options = {}, factory) {
      options = _.merge({}, config, options);

      // Build python
      const python = {
        command: `/sbin/tini -- /lagoon/entrypoints.sh ${options.command}`,
        ports: [options.port],
      };
      options.moreHttpPorts.push(options.port);
      // Add in the python service and push downstream
      super(id, options, {services: _.set({}, options.name, python)});
    };
  },
};
