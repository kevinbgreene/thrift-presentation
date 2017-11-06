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
* Communication across multiple service runtimes (JVM, Node)
* Compile-time guarantees for service contracts

---

# Solution: Thrift and TypeScript

* TypeScript provides compile-time type-safety for service source
* Thrift provides compile-time type-safety for service contracts

---

# Apache Thrift

* An interface definition language (IDL) and RPC framework with codegen
* Originally developed at Facebook
* Service clients and service processors are generated
* Code generators for many languages (Java, JS, PHP, Go, Lua...)
* https://thrift.apache.org/

---

# Existing Apache Thrift Library

* Code generator written in C++
* Node.js libs not well-maintained
* Doesn't leverage common OSS libraries and frameworks
* Generated TypeScript code is lacking
* https://github.com/apache/thrift

---

# Node.js Thrift Implementation Built on TypeScript

* Be good OSS citizens
* Develop on top of existing libraries and frameworks
* Develop libraries that feel familiar to JS developers

---

# A Modular Suite of Tools

* Solve problems in a modular way
* Thrift Parser
* Thrift TypeScript
* Thrift Server (Hapi and Express)
* Thrift Client (Request and Axios)

---

# Native TypeScript Codegen

* Easy to integrate into a JS build pipeline
* Easy for the JS community to contribute to
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

# Thrift TypeScript

* A code generator that consumes Thrift files and produces TypeScript files
* Generated code can be compiled with strict compiler flags
* Generated code is compatible with the Apache Thrift libs

---

# Use Libraries Familiar to Node.js Developers

* Servers: Hapi / Express
* Clients: Request / Axios

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

# Thrift Client: Request and Axios

* Provide base Request or Axios instance
* Use Axios interceptors to make per request updates to headers for auth / tracing

```sh
$ npm install --save @creditkarma/thrift-client
```