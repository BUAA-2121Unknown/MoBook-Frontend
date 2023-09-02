
import { Server } from "@hocuspocus/server";
import debounce from "debounce";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { Database } from "@hocuspocus/extension-database";
import { Redis } from "@hocuspocus/extension-redis";
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import * as Y from 'yjs'
import { fromUint8Array, toUint8Array } from 'js-base64'
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

let debounced;

// 数据库部分
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()
const pool = mysql.createPool({
  connectionLimit: 100, //important
  // host: '81.70.161.76',
  host: '127.0.0.1',
  port: 3306,
  // user: 'admin',
  user: 'root',
  // password: '2121_MySQL_Admin',
  password: 'adk2002',
  database: 'se2023',
  debug: false
});

// async function insertDoc({user_id, prosemirrorJSON}) {
//   const created_at = new Date();
//   const updated_at = new Date();

//   query = 
//   pool?.query(
//     `INSERT INTO "documents" ("user_id", "data") VALUES ($user_id, $data)`,
//     {
//       $user_id: user_id,
//       $data: prosemirrorJSON,
//     }
//   );
// } 

function fmtForm(object, keys) {
  const subset = {};

  for (const key of keys) {
    if (object.hasOwnProperty(key)) {
      subset[key] = object[key];
    } else {
      subset[key] = null
    }
  }
  return subset;
}

const service = axios.create({
  baseURL: "http://81.70.161.76/api/",
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// 上传文件的接口
const uploadDoc = (data, token) => {
  const form = [
    'projId',
    'itemId',
    'version',
    'content'
  ]
  service.defaults.headers.common = {
    'Content-Type': 'multipart/form-data',
    'Authorization': token
  }
  return service({
    url: 'artifact/file/upload/content',
    method: 'post',
    data: fmtForm(data, form)
  })
}

// 获取文件的接口
export const getDocContent = (params, token) => {
  service.defaults.headers.common = {
    'Content-Type': 'application/json',
    'Authorization': token
  }
  return service({
    url: "artifact/file/download/content",
    method: "get",
    params: params,
  });
};

// 获取文档token对应的权限
export const getDocAuth = (params) => {
  return service({
    url: "live/token/auth",
    method: "get",
    params: params,
  });
};

const uploadFormData = {
  'projId': '',
  'itemId': '',
  'version': '',
  'content': ''
}
const queryData = {
  'projId': '',
  'itemId': '',
  'version': '',
}

// 为了使用transformer.toYoc
const Title = Heading.extend({
  name: "title",
  group: "title",
  parseHTML: () => [{ tag: "h1:first-child" }],
}).configure({ levels: [1] });
const DocumentWithTitle = Document.extend({
  content: "title block*",
});
import Heading from '@tiptap/extension-heading'
import { Node } from '@tiptap/core'
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'



const server = Server.configure({
  beforeHandleMessage(data) {
    // console.log(data)
  },
  async onAuthenticate(data) {
    // console.log(data)
    // Example test if a user is authenticated using a
    // request parameter
    // if (auth === "0") {
    //   // data.connection.readOnly = true;
    //   throw new HttpException('您无权查看此文档', HttpStatus.FORBIDDEN);
    //   // throw new Error("Not authorized!");
    // }
    // else if (auth === "1") {
    //   data.connection.readOnly = true;
    // }
    // else if (auth === "2") {
    //   data.connection.readOnly = false;
    // }
    // Example to set a document to read only for the current user
    // thus changes will not be accepted and synced to other clients
    // if (someCondition === true) {
    //   data.connection.readOnly = true;
    // }

    // You can set contextual data to use it in other hooks
    // console.log(data)
    // return {
    //   user: {
    //     name: username + data.socketId,
    //   },
    // };
  },

  async onConnect(data) {
    // Output some information
    console.log(`New websocket connection`);
  },
  async onChange(data) {
    const save = () => {
      const { requestParameters } = data
      /* 保存文件*/
      // uploadFormData.itemId = 36
      // uploadFormData.projId = 1
      // uploadFormData.version = 1
      uploadFormData.itemId = parseInt(requestParameters.get('doc_id'))
      uploadFormData.projId = parseInt(requestParameters.get('projId'))
      // uploadFormData.version = parseInt(requestParameters.get('version'))
      uploadFormData.version = 1000000
      const jwtToken = requestParameters.get('jwtToken')

    // const state = Buffer.from(
    //   Y.encodeStateAsUpdate(data.document)
    // )
    // const filebase64 = fromUint8Array(state)
    // uploadFormData.content = filebase64

      // console.log("🚀 > onStoreDocument > data:", data);
      const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document)
      console.log("🚀 > onStoreDocument > prosemirrorJSON:", prosemirrorJSON);
      uploadFormData.content = JSON.stringify(prosemirrorJSON);
      console.log("🚀 > onStoreDocument > uploadFormData.content:", uploadFormData.content);
      const res = uploadDoc(uploadFormData, jwtToken)
      console.log("store success")
    };
    debounced?.clear();
    debounced = debounce(save, 60000);
    debounced();
  },

  async onLoadDocument(data) {
    console.log("start onloadDocument")
    const { requestParameters, document } = data

    queryData.itemId = parseInt(requestParameters.get('doc_id'))
    queryData.projId = parseInt(requestParameters.get('projId'))
    queryData.version = 0
    const jwtToken = requestParameters.get('jwtToken')

    console.log("version: " + queryData.version)
    const content = await getDocContent(queryData, jwtToken).then((res) => {
      return res.data.data.content;
    }).catch((err) => {
      // // console.log("🚀 > content > err:", err);
      return null;
    });

    if (content == null) {
      return null;
    }
    // console.log("🚀 > onLoadDocument > content:", content);

    // const int8data = toUint8Array(res.data.data.content)
    // console.log(res.data.data.content)
    // if (int8data.byteLength) {
    //   Y.applyUpdate(document, int8data);
    // }
    const json = content.length == 0 ? {} : JSON.parse(content)
    // console.log("🚀 > onLoadDocument > json:", json);
    try {
      const ydoc = TiptapTransformer.toYdoc(
        // the actual JSON
        json,
        "default",
        // The Tiptap extensions you’re using. Those are important to create a valid schema.
        [Document, Paragraph, Text, Title, Underline, Highlight, TaskItem, TaskList]
      );
      // console.log(ydoc)
      return ydoc
    } catch (err) {
      // console.log("🚀 > onLoadDocument > err:", err);
    }
    console.log("end onloadDocument")
  },

  // extensions: [
  //   // new Redis({
  //   //   // [required] Hostname of your Redis instance
  //   //   host: "127.0.0.1",
  //   //   // [required] Port of your Redis instance
  //   //   port: 6379,
  //   // }),
  //   new Database({
  //     // Return a Promise to retrieve data …
  //     fetch: async ({requestParameters}) => {
  //       return new Promise((resolve, reject) => {
  //         console.log("Trying to fetch document")
  //         console.log(requestParameters.get('doc_id'))
  //         pool?.query(
  //           'SELECT data FROM documents WHERE id = ? ORDER BY id DESC',
  //           [requestParameters.get('doc_id')],
  //           (error, row) => {
  //             if (error) {
  //               reject(error);
  //             }
  //             resolve(row.data);
  //           }
  //         );
  //       });
  //     },
  //     // … and a Promise to store data:
  //     store: async ({ documentName, state, requestParameters}) => {
  //       console.log("store")
  //       console.log(requestParameters.get('doc_id'))
  //       pool?.query(
  //         "INSERT INTO documents (name, data, id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = ?",
  //         [documentName, state, requestParameters.get('doc_id'), state],
  //       );
  //     },
  //   }),
  // ],
});

server.listen();