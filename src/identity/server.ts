import * as Hapi from 'hapi';

import {
  ThriftPlugin,
} from '@creditkarma/thrift-server-hapi';

import {
  User,
  UserService,
  UserServiceException,
} from '../codegen/com/identity/v2/UserService';

import {
  SERVER_CONFIG,
} from './config';

import {
  IMockUser,
  MockUserDatabase,
} from './data';

function findUser(id: number): IMockUser | undefined {
  return MockUserDatabase.filter((next) => {
    return next.id === id;
  })[0];
}

const serviceProcessor: UserService.Processor<Hapi.Request> =
  new UserService.Processor({
    getUser(id: number, context?: Hapi.Request): User {
      const user = findUser(id);
      if (user !== undefined) {
        return new User(user);
      } else {
        throw new UserServiceException({
          message: `Unable to find user for id: ${id}`,
        });
      }
    },
  });

const server = new Hapi.Server({ debug: { request: ['error'] } });

server.connection({ port: SERVER_CONFIG.port });

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
  path: '/',
  handler: {
    thrift: {
      service: serviceProcessor,
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
  console.log('info', `Server running on port ${SERVER_CONFIG.port}`);
});
