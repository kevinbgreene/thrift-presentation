// import {
//   createClient,
//   fromAxios,
//   HttpConnection,
// } from '@creditkarma/thrift-client';

// import { AxiosInstance, default as axios } from 'axios';
// import * as express from 'express';

// import {
//   ContentService,
//   ContentServiceException,
//   Post,
//   PublishedDate,
// } from '../codegen/com/content/ContentService';

// import {
//   User,
//   UserService,
// } from '../codegen/com/identity/v2/UserService';

// import {
//   findPost,
//   IMockPost,
// } from './data';

// import {
//   IDENTITY_SERVER_V2,
// } from './config';

// const axiosUserInstance: AxiosInstance = axios.create();
// const userConnectionV2: HttpConnection<UserService.Client> = fromAxios(axiosUserInstance, IDENTITY_SERVER_V2);
// const userClientV2: UserService.Client = createClient(UserService.Client, userConnectionV2);

// export const serviceHandler: ContentService.IHandler<express.Request> = {
//   getPost(id: number, context?: express.Request): Promise<Post> {
//     console.log(`ContentService: getPost: ${id}`);
//     const post: IMockPost | undefined = findPost(id);
//     if (post !== undefined) {
//       return userClientV2.getUser(post.author).then((author: User) => {
//         return new Post({
//           id: post.id,
//           author,
//           date: new PublishedDate(post.date),
//           title: post.title,
//           body: post.body,
//         });
//       });
//     } else {
//       throw new ContentServiceException({
//         message: `Unable to find post for id: ${id}`,
//       });
//     }
//   },
// };
