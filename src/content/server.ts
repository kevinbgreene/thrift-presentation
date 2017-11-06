import {
  createClient,
  fromAxios,
  HttpConnection,
} from '@creditkarma/thrift-client';

import {
  thriftExpress,
} from '@creditkarma/thrift-server-express';

import { AxiosInstance, default as axios } from 'axios';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import {
  ContentService,
  ContentServiceException,
  Post,
  PublishedDate,
} from '../codegen/com/content/ContentService';

import {
  User,
  UserService,
} from '../codegen/com/identity/v2/UserService';

import {
  CONTENT_SERVER,
  IDENTITY_SERVER,
} from './config';

import {
  IMockPost,
  MockPostDatabase,
} from './data';

function findPost(id: number): IMockPost | undefined {
  return MockPostDatabase.filter((next) => {
    return next.id === id;
  })[0];
}

// SET UP IDENTITY CLIENT

const axiosUserInstance: AxiosInstance = axios.create();
const userConnection: HttpConnection<UserService.Client> = fromAxios(axiosUserInstance, IDENTITY_SERVER);
const userClient: UserService.Client = createClient(UserService.Client, userConnection);

const serviceHandler: ContentService.IHandler<void> = {
  getPost(id: number): Promise<Post> {
    const post: IMockPost | undefined = findPost(id);
    if (post !== undefined) {
      return userClient.getUser(post.author).then((author: User) => {
        return new Post({
          id: post.id,
          author,
          date: new PublishedDate(post.date),
          title: post.title,
          body: post.body,
        });
      });
    } else {
      throw new ContentServiceException({
        message: `Unable to find post for id: ${id}`,
      });
    }
  },
};

// SET UP OUR EXPRESS INSTANCE

const app: express.Application = express();

app.use(
  '/',
  bodyParser.raw(),
  thriftExpress(ContentService.Processor, serviceHandler),
);

app.listen(CONTENT_SERVER.port, () => {
  console.log(`Thrift server listening at http://${CONTENT_SERVER.hostName}:${CONTENT_SERVER.port}`);
});
