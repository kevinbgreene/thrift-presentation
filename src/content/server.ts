import {
  thriftExpress,
} from '@creditkarma/thrift-server-express';

import * as bodyParser from 'body-parser';
import * as express from 'express';

import {
  ContentService,
} from '../codegen/com/content/ContentService';

import {
  CONTENT_SERVER,
} from './config';

import {
  serviceHandler,
} from './userService_v1';

const app: express.Application = express();

app.use(
  '/',
  bodyParser.raw(),
  thriftExpress(ContentService.Processor, serviceHandler),
);

app.listen(CONTENT_SERVER.port, () => {
  console.log(`Thrift server listening at http://${CONTENT_SERVER.hostName}:${CONTENT_SERVER.port}`);
});
