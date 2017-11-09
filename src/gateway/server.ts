import {
  createClient,
  fromAxios,
  HttpConnection,
} from '@creditkarma/thrift-client';

import { AxiosInstance, default as axios } from 'axios';
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

// SET UP IDENTITY CLIENT

const axiosUserInstance: AxiosInstance = axios.create();
const userConnection: HttpConnection<UserService.Client> = fromAxios(axiosUserInstance, IDENTITY_SERVER);
const userClient: UserService.Client = createClient(UserService.Client, userConnection);

// SET UP CONTENT CLIENT

const axiosContentInstance: AxiosInstance = axios.create();
const contentConnection: HttpConnection<ContentService.Client> = fromAxios(axiosContentInstance, CONTENT_SERVER);
const contentClient: ContentService.Client = createClient(ContentService.Client, contentConnection);

// START API SERVER

app.get('/healthcheck', (req, res) => {
  res.send('success');
});

app.get('/user/:id', (req, res) => {
  console.log(`Gateway: fetching user with id: ${req.params.id}`);
  userClient.getUser(req.params.id).then((user: User) => {
    res.send(user);
  }, (err: any) => {
    res.send(err).status(500);
  });
});

app.get('/post/:id', (req, res) => {
  console.log(`Gateway: fetching post with id: ${req.params.id}`);
  contentClient.getPost(req.params.id).then((post: Post) => {
    res.send(post);
  }, (err: any) => {
    res.send(err).status(500);
  });
});

app.listen(GATEWAY_SERVER.port, () => {
  console.log(`Web server listening at http://${GATEWAY_SERVER.hostName}:${GATEWAY_SERVER.port}`);
});
