import * as Hapi from 'hapi';

import {
  ThriftPlugin,
} from '@creditkarma/thrift-server-hapi';

import {
  serviceProcessor as serviceProcessorV1,
} from './serviceProcessor_v1';

import {
  serviceProcessor as serviceProcessorV2,
} from './serviceProcessor_v2';

import {
  SERVER_CONFIG_V1,
  SERVER_CONFIG_V2,
} from './config';

const server = new Hapi.Server({ debug: { request: ['error'] } });

server.connection({ port: SERVER_CONFIG_V1.port });

/**
 * Register the thrift plugin.
 *
 * This will allow us to define Hapi routes for our thrift service(s).
 * They behave like any other HTTP route handler, so you can mix and match
 * thrift / REST endpoints on the same server instance.
 */
server.register(ThriftPlugin, (err: any) => {
  if (err) {
    throw err;
  }
});

/**
 * Route to our thrift service.
 *
 * Payload parsing is disabled - the thrift plugin parses the raw request
 * using whichever protocol is configured (binary, compact, json...)
 */
server.route({
  method: 'POST',
  path: SERVER_CONFIG_V1.path,
  handler: {
    thrift: {
      service: serviceProcessorV1,
    },
  },
  config: {
    payload: {
      parse: false,
    },
  },
});

server.route({
  method: 'POST',
  path: SERVER_CONFIG_V2.path,
  handler: {
    thrift: {
      service: serviceProcessorV2,
    },
  },
  config: {
    payload: {
      parse: false,
    },
  },
});

/**
 * Finally, we're ready to start the server.
 */
server.start((err: any) => {
  if (err) {
    throw err;
  }
  console.log('info', `Server running on port ${SERVER_CONFIG_V1.port}`);
});
