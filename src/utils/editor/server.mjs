
import { Server } from "@hocuspocus/server";
import  debounce  from "debounce";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { Database } from "@hocuspocus/extension-database";
import { Redis } from "@hocuspocus/extension-redis";
let debounced;

// 数据库部分
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()
const pool = mysql.createPool({
    connectionLimit: 100, //important
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'adk2002',
    database: 'SE2023',
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

const server = Server.configure({
  beforeHandleMessage(data) {
    console.log(data)
  },
  async onAuthenticate(data) {
    console.log(data)
    const { token } = data;
    // Example test if a user is authenticated using a
    // request parameter
    const auth = token.split("-")[0]
    const doc_id = parseInt(token.split("-")[1])
    const username = token.split("-")[2]
    console.log(auth)
    console.log(doc_id)
    console.log(username)
    
    if (auth === "0") {
      data.connection.readOnly = true;
      throw new Error("Not authorized!");
    }
    else if (auth === "1") {
      data.connection.readOnly = true;
    }
    else if (auth === "2") {
      data.connection.readOnly = false;
    }
    // Example to set a document to read only for the current user
    // thus changes will not be accepted and synced to other clients
    // if (someCondition === true) {
    //   data.connection.readOnly = true;
    // }
    
    // You can set contextual data to use it in other hooks
    return {
      user: {
        id: 1234,
        name: username,
      },
      doc_id: doc_id
    };
  },
  async onConnect(data) {
    // Output some information
    console.log(`New websocket connection`);
  },
  async onChange(data) {
    const save = () => {
      // Convert the y-doc to something you can actually use in your views.
      // In this example we use the TiptapTransformer to get JSON from the given
      // ydoc.
      const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);
      // Save your document. In a real-world app this could be a database query
      // a webhook or something else
      // console.log(data.context)
      const user_id = data.context.user.id;
      // insertDoc({user_id, prosemirrorJSON})
      // Maybe you want to store the user who changed the document?
      // Guess what, you have access to your custom context from the
      // onConnect hook here. See authorization & authentication for more
      // details
      // console.log(`Document ${data.documentName} changed by ${data.context.user.name}`);
    };
    debounced?.clear();
    debounced = debounce(save, 4000);
    debounced();
  },
  extensions: [
    // new Redis({
    //   // [required] Hostname of your Redis instance
    //   host: "127.0.0.1",
    //   // [required] Port of your Redis instance
    //   port: 6379,
    // }),
    new Database({
      // Return a Promise to retrieve data …
      fetch: async ({context}) => {
        return new Promise((resolve, reject) => {
          console.log("Trying to fetch document")
          pool?.query(
            'SELECT data FROM documents WHERE id = ? ORDER BY id DESC',
            [context.doc_id],
            (error, row) => {
              if (error) {
                reject(error);
              }
              resolve(row[0]?.data);
            }
          );
        });
      },
      // … and a Promise to store data:
      store: async ({ documentName, state, context}) => {
        pool?.query(
          "INSERT INTO documents (name, data, id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = ?",
          [documentName, state, context.doc_id, state],
        );
      },
    }),
  ],
});

server.listen();