import {
  ConnectOptions,
  createHttpClient,
  createHttpConnection,
  HttpConnection,
  TBinaryProtocol,
  TBufferedTransport,
} from 'thrift';

import * as express from 'express';

import {
  User,
  UserService,
} from '../codegen/com/identity/v2/UserService';

import {
  ContentService,
  Post,
} from '../codegen/com/content/ContentService';

import {
  CONTENT_SERVER,
  GATEWAY_SERVER,
  IDENTITY_SERVER,
} from './config';

const app: express.Application = express();

const options: ConnectOptions = {
  transport: TBufferedTransport,
  protocol: TBinaryProtocol,
  https: false,
  headers: {
    host: IDENTITY_SERVER.hostName,
  },
};

// SET UP IDENTITY CLIENT

const userConnection: HttpConnection =
  createHttpConnection(IDENTITY_SERVER.hostName, IDENTITY_SERVER.port, options);

const userClient: UserService.Client =
  createHttpClient(UserService.Client, userConnection);

userConnection.on('error', (err: Error) => {
  console.log('err: ', err);
  process.exit(1);
});

// SET UP CONTENT CLIENT

const contentConnection: HttpConnection =
  createHttpConnection(CONTENT_SERVER.hostName, CONTENT_SERVER.port, options);

const contentClient: ContentService.Client =
  createHttpClient(ContentService.Client, contentConnection);

contentConnection.on('error', (err: Error) => {
  console.log('err: ', err);
  process.exit(1);
});

// START API SERVER

app.get('/healthcheck', (req, res) => {
  res.send('success');
});

app.get('/user', (req, res) => {
  userClient.getUser(req.query.id).then((user: User) => {
    res.send(user);
  }, (err: any) => {
    res.send(err).status(500);
  });
});

app.get('/post', (req, res) => {
  contentClient.getPost(req.query.id).then((post: Post) => {
    res.send(post);
  }, (err: any) => {
    res.send(err).status(500);
  });
});

app.listen(GATEWAY_SERVER.port, () => {
  console.log(`Web server listening at http://${GATEWAY_SERVER.hostName}:${GATEWAY_SERVER.port}`);
});
