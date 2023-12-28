'use strict';

// Modules
const _ = require('lodash');

// Builder
module.exports = {
  name: 'lagoon-basic',
  config: {
    version: 'custom',
    confSrc: __dirname,
    command: '',
    port: '',
    moreHttpPorts: [],
  },
  parent: '_lagoon',
  builder: (parent, config) => class LandoLagoonBasic extends parent {
    constructor(id, options = {}, factory) {
      options = _.merge({}, config, options);

      // Build basic
      const basic = {
        command: `/sbin/tini -- /lagoon/entrypoints.sh ${options.command}`,
        ports: [options.port],
        volumes: options.volumes,
      };
      if (options.command == '') {
        throw Error(
          'Please specify a relevant command for this service via .lando.yml',
        );
      }
      options.moreHttpPorts.push(options.port);
      // Add in the basic service and push downstream
      super(id, options, {services: _.set({}, options.name, basic)});
    };
  },
};
