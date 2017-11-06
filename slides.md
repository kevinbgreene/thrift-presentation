# Type-Safe Microservices in Node.js with Thrift and TypeScript
## Kevin B. Greene

---

# About Me

* Full-stack Software Engineer
* Github / Twitter: kevinbgreene
* Source: https://github.com/kevinbgreene/thrift-presentation

---

# Problem: Type-Safety Across Node.js Services

* Type-safety within our service source and across service boundaries
* Communication across multiple service runtimes (JVM, Node...)
* Compile-time guarantees for service contracts

---

# Solution: Thrift and TypeScript

* TypeScript provides compile-time type-safety for service source
* Thrift provides type-safety between services
* TypeScript generated from Thrift provides type-safety for service contracts

---

# Apache Thrift

* An interface definition language (IDL) and RPC framework with codegen
* Originally developed at Facebook
* Service clients and service processors are generated
* Code generators for many languages (Java, JS, PHP, Go, Lua...)
* https://thrift.apache.org/
* https://github.com/apache/thrift

---

# Complications with Existing Apache Thrift Library

* Code generator written in C++
* Node.js libs not well-maintained
* Doesn't leverage common OSS libraries and frameworks
* Generated TypeScript code is lacking

---

# Node.js Thrift Implementation Built on TypeScript

* Be good OSS citizens
* Develop on top of existing libraries and frameworks
* Develop libraries that feel familiar to JS developers

---

# A Modular Suite of Tools

* Thrift Parser
* Thrift TypeScript
* Thrift Server (Hapi and Express)
* Thrift Client (Request and Axios)
* Thrift Utils (encode and decode Thrift objects)

---

# Native TypeScript Codegen

* Easy to integrate into a JS build pipeline
* Easy for the JS community (consumers) to contribute to
* Strictly compiled TypeScript source
* Extensible to meet custom requirements
* Generated code can be used with the Apache Thrift libs

---

# Thrift Parser

* Consumes strings of Thrift source and generates a typed AST
* Can be used by other code generators

```sh
$ npm install --save @creditkarma/thrift-parser
```

---

# Parser Usage

```typescript
import { parse, ThriftDocument } from '@creditkarma/thrift-parser'

const rawThrift: string =`
  struct MyStruct {
    1: required i32 id
  }
`;

const thriftAST: ThriftDocument = parse(rawThrift);
```

---

# Parser Demo

---

# Thrift TypeScript

* A code generator that consumes Thrift files and produces TypeScript files
* Generated code can be compiled with strict compiler flags
* Generated code is compatible with the Apache Thrift libs

```sh
$ npm install --save @creditkarma/thrift-typescript
```

---

# Generator Usage: JS API

```typescript
import { generate } from '@creditkarma/thrift-typescript';

generate({
  rootDir: '.',
  sourceDir: 'thirft',
  outDir: 'codegen',
  files: [
    'simple.thrift'
  ]
});
```

---

# Generator Usage: CLI

```sh
$ thrift-typescript --sourceDir thrift --outDir codegen simple.thrift
```

---

# Generator Demo

---

# Thrift Server

* Thrift core implementation in TypeScript
* Built using common HTTP client / server libraries
* Hapi / Express used for servers
* Request / Axios used for clients

---

# Thrift Server: Hapi and Express

* Build servers in ways familiar to most Node.js developers
* Add Thrift to an existing server via a plugin or middleware
* HTTP only
* TCP omitted with the intent to build on HTTP2

```sh
$ npm install --save @creditkarma/thrift-server-hapi
$ npm install --save @creditkarma/thrift-server-express
```

---

# Example Service

```c
struct Item {
  1: i32 id
  2: string name
}

service TestService {
  Item getItem(1: i32 itemId)
}
```

---

# Usage: Define Service Handlers

```typescript
import * as express from 'express';
import { Item, TestService } from './generated/TestService';

export const serviceHandlers: TestService.IHandler<express.Request> = {
  getItem(itemId: number, context?: express.Request): Item | Promise<Item> {
    return new Item()
  }
}
```

---

# Express Usage: Register Middleware

```typescript
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { thriftExpress } from '@creditkarma/thrift-server-express';
import { serviceHandlers } from './handlers';
import { TestService } from './generated/TestService';

const app: express.Application = express();

app.use('/thrift', bodyParser.raw(),
  thriftExpress(TestService.Processor, serviceHandlers),
);
```

---

# Hapi Usage: Register Plugin

```typescript
import * as Hapi from 'hapi';
import { ThriftPlugin } from '@creditkarma/thrift-server-hapi';
import { serviceHandlers } from './handlers';
import { TestService } from './generated/TestService';

const server = new Hapi.Server({ debug: { request: ['error'] } });
server.connection({ port: SERVER_CONFIG.port });

server.register(ThriftPlugin, (err: any) => {
  if (err) {
    throw err
  }
});
```

---

# Hapi Usage: Define Service Handlers

```typescript
server.route({
  method: 'POST',
  path: '/thrift',
  handler: {
    thrift: {
      service: new TestService.Processor(serviceHandlers),
    },
  },
  config: { payload: { parse: false } },
});
```

---

# Server Demo

---

# Thrift Client: Request and Axios

* Provide base Request or Axios instance
* Use Axios interceptors to make per request updates to headers for auth / tracing

```sh
$ npm install --save @creditkarma/thrift-client
```

---

# Client Usage: Instantiate Client

```typescript
import {
  RequestInstance,
  createClient,
  fromAxios,
  HttpConnection,
} from '@creditkarma/thrift-client';
import { TestService } from './generated';

const requestClient: AxiosInstance = axios.create();
const connection: HttpConnection<TestService.Client> = fromAxios(requestClient, config);
const serviceClient: TestService.Client = createClient(TestService.Client, connection);
```

---

# Client Usage: Call Service Methods

```typescript
app.get('/item', (req: express.Request, res: express.Response): void => {
  serviceClient.getItem(req.query.id).then(() => {
    res.send('success');
  }, (err: any) => {
    res.status(500).send(err);
  })
});
```

---

# Client Demo