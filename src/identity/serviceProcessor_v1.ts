import * as Hapi from 'hapi';

import {
  User,
  UserService,
  UserServiceException,
} from '../codegen/com/identity/v1/UserService';

import {
  findUser,
  IMockUser,
} from './data';

export const serviceProcessor: UserService.Processor<Hapi.Request> =
  new UserService.Processor({
    getUser(id: number, context?: Hapi.Request): User {
      console.log(`UserService_v1: getUser: ${id}`);
      const user: IMockUser | undefined = findUser(id);
      if (user !== undefined) {
        return new User({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        });
      } else {
        throw new UserServiceException({
          message: `Unable to find user for id: ${id}`,
        });
      }
    },
  });
