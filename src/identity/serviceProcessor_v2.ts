import * as Hapi from 'hapi';

import {
  User,
  UserService,
  UserServiceException,
} from '../codegen/com/identity/v2/UserService';

import {
  findUser,
  IMockUser,
} from './data';

export const serviceProcessor: UserService.Processor<Hapi.Request> =
  new UserService.Processor({
    getUser(id: number, context?: Hapi.Request): User {
      console.log(`UserService_v2: getUser: ${id}`);
      const user: IMockUser | undefined = findUser(id);
      if (user !== undefined) {
        return new User(user);
      } else {
        throw new UserServiceException({
          message: `Unable to find user for id: ${id}`,
        });
      }
    },
  });
