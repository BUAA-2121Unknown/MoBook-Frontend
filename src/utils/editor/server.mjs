
import { Server } from "@hocuspocus/server";
import  debounce  from "debounce";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { Database } from "@hocuspocus/extension-database";
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
  async onAuthenticate(data) {
    const { token } = data;
    // Example test if a user is authenticated using a
    // request parameter
    if (!token) {
      throw new Error("Not authorized!");
    }
    const doc_id = token.split("-")[0]
    console.log(token)
    // Example to set a document to read only for the current user
    // thus changes will not be accepted and synced to other clients
    // if (someCondition === true) {
    //   data.connection.readOnly = true;
    // }

    // You can set contextual data to use it in other hooks
    return {
      user: {
        id: 1234,
        name: token,
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
      console.log(data.context)
      const user_id = data.context.user.id;
      // insertDoc({user_id, prosemirrorJSON})
      // Maybe you want to store the user who changed the document?
      // Guess what, you have access to your custom context from the
      // onConnect hook here. See authorization & authentication for more
      // details
      console.log(`Document ${data.documentName} changed by ${data.context.user.name}`);
    };
    debounced?.clear();
    debounced = debounce(save, 4000);
    debounced();
  },
  extensions: [
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
        console.log(
          "Trying to save to mysql" +
              documentName +
              " : " +
              JSON.stringify(state)
        );
        pool?.query(
          "INSERT INTO documents (name, data, id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = ?",
          [documentName, state, context.doc_id, state],
        );
      },
    }),
  ],
});

server.listen();