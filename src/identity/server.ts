import {
  createWebServer,
  TBinaryProtocol,
  TBufferedTransport,
} from 'thrift';

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

const serviceHandler: UserService.IHandler<void> = {
  getUser(id: number): User {
    const user = findUser(id);
    if (user !== undefined) {
      return new User(user);
    } else {
      throw new UserServiceException({
        message: `Unable to find user for id: ${id}`,
      });
    }
  },
};

// ServiceOptions: The I/O stack for the service
const serviceOptions = {
  handler: serviceHandler,
  processor: UserService,
  protocol: TBinaryProtocol,
  transport: TBufferedTransport,
};

// ServerOptions: Define server features
const serverOpt = {
  services: {
    '/': serviceOptions,
  },
};

// Create and start the web server
createWebServer<UserService.Processor<void>, UserService.IHandler<void>>(serverOpt).listen(SERVER_CONFIG.port, () => {
  console.log(`Thrift server listening at http://${SERVER_CONFIG.hostName}:${SERVER_CONFIG.port}`);
});
