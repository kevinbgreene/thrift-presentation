import {
  ConnectOptions,
  createHttpClient,
  createHttpConnection,
  createWebServer,
  HttpConnection,
  TBinaryProtocol,
  TBufferedTransport,
} from 'thrift';

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

const options: ConnectOptions = {
  transport: TBufferedTransport,
  protocol: TBinaryProtocol,
  https: false,
  headers: {
    host: IDENTITY_SERVER.hostName,
  },
};

const userConnection: HttpConnection =
  createHttpConnection(IDENTITY_SERVER.hostName, IDENTITY_SERVER.port, options);

const userClient: UserService.Client =
  createHttpClient(UserService.Client, userConnection);

userConnection.on('error', (err: Error) => {
  process.exit(1);
});

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

// ServiceOptions: The I/O stack for the service
const serviceOptions = {
  handler: serviceHandler,
  processor: ContentService,
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
createWebServer<ContentService.Processor<void>, ContentService.IHandler<void>>(serverOpt)
  .listen(CONTENT_SERVER.port, () => {
    console.log(`Thrift server listening at http://${CONTENT_SERVER.hostName}:${CONTENT_SERVER.port}`);
  });
