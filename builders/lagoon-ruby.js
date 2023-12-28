'use strict';

// Modules
const _ = require('lodash');

// Builder
module.exports = {
  name: 'lagoon-ruby',
  config: {
    version: 'custom',
    confSrc: __dirname,
    command: 'ruby',
    port: '3000',
    moreHttpPorts: [],
  },
  parent: '_lagoon',
  builder: (parent, config) => class LandoLagoonRuby extends parent {
    constructor(id, options = {}, factory) {
      options = _.merge({}, config, options);

      // Build ruby
      const ruby = {
        command: `/sbin/tini -- /lagoon/entrypoints.sh ${options.command}`,
        ports: [options.port],
      };
      options.moreHttpPorts.push(options.port);
      // Add in the ruby service and push downstream
      super(id, options, {services: _.set({}, options.name, ruby)});
    };
  },
};
