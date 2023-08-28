<template>
  <div class="window-container">
    <vue-advanced-chat height="calc(80vh - 20px)" :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)"
      :load-first-room="false" :rooms-loaded="true" :messages="JSON.stringify(messages)" :messages-loaded="messagesLoaded"
      :show-new-messages-divider="false" @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])" />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()

export default {
  data() {
    return {
      newSocket: null,
      //实时连接
      lockReconnect: false,
      wsCfg: {
        // websocket地址
        url: "ws://82.156.25.78:5000/ws/chat/1/"
      },
      currentUserId: '1234',
      roomId: '',
      rooms: [
        {
          roomId: '1',
          roomName: '不知名六人组',
          unreadCount: 4,
          index: 3,
          avatar: 'https://picx.zhimg.com/v2-7f2dbdcc084f3e70c135adc6e5406d33_r.jpg?source=1940ef5c',
          lastMessage: {
            _id: 'xyz',
            content: '大家加油冲冲冲',
            senderId: '1234',
            username: '陈锐',
            timestamp: '23:19',
            saved: false,
            distributed: false,
            seen: false,
            new: true,
            failure: true
          },
          users: [
            { _id: '1234', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
            { _id: '4321', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
            { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
            { _id: '4111', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
            { _id: '4111', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
            { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
          ],
          messages: [
            {

            }
          ],
        },
        {
          roomId: '2',
          roomName: '软件工程课程群',
          unreadCount: 72,
          index: 4,
          avatar: 'https://pic1.zhimg.com/80/v2-b7cccb43cd10a9aa0e1ef079acfc150f_720w.webp?source=1940ef5c',
          lastMessage: {
            _id: 'xyz',
            content: '听我说，谢谢你，软件工程，你真好',
            senderId: '1234',
            username: 'zhoues',
            timestamp: '23:17',
            distributed: false,
            seen: false,
            new: true
          },
          users: [
            { _id: '1234', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
            { _id: '4321', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
            { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
            { _id: '4111', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
            { _id: '4111', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
            { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
          ],
          messages: [
            {

            }
          ],
        }
      ],
      messages: [],
      messagesLoaded: false,
      allUsers: [],
    }
  },
  mounted() {
    this.createWebSocket();
  },
  methods: {
    //建立http链接 请求当前房间聊天记录
    requestMessages() {

    },
    createWebSocket() {
      try {
        // 创建Web Socket 连接
        const socket = new WebSocket(this.wsCfg.url);
        // 初始化事件
        this.initEventHandle(socket);
      } catch (e) {
        // 出错时重新连接
        this.reconnect(this.wsCfg.url);
        console.log("尝试连接");
      }
    },
    initEventHandle(socket) {
      console.log("尝试连接");
      // 连接关闭时触发
      socket.onclose = () => {
        console.log("连接关闭");
      };
      // 通信发生错误时触发
      socket.onerror = () => {
        // 重新创建长连接
        this.reconnect();
        console.log("连接错误");
      };
      // 连接建立时触发
      socket.onopen = () => {
        console.log("连接成功");
        this.newSocket = socket;
      };
      // 客户端接收服务端数据时触发
      socket.onmessage = msg => {
        // 业务逻辑处理
        this.addNewMessage()
        console.log(msg.data, "ws:data");

      };
    },
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;

      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(() => {
        this.lockReconnect = false;
        this.createWebSocket(this.wsCfg.url);
      }, 2000);
    },
    test() {
      console.log("发送信息");
      // 给服务器发送一个字符串:
      // ws.send("Hello!");
      // 创建要发送的 JSON 对象
      const jsonData = {
        message: "Hello from JSON",
        data: "haha",
        timestamp: Date.now()
      };

      // 将 JSON 对象转换为字符串并发送
      this.newSocket.send(JSON.stringify(jsonData));

      console.log("发送成功");
    },

    nowDate() {
      //将标准日期处理一下
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加 1 是因为月份从 0 开始计数
      const day = String(currentDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate
    },

    fetchMessages({ room, options = {} }) {
      room.unreadCount = 0
      this.messagesLoaded = false
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true)
          this.messagesLoaded = true
        } else {
          this.messages = [...this.addMessages(), ...this.messages]
          this.messagesLoaded = true
        }
        // this.addNewMessage()
      })
    },

    addMessages(reset) {
      const messages = []

      for (let i = 0; i < 9; i++) {
        messages.push({
          _id: reset ? i : this.messages.length + i,
          content: `${reset ? '' : 'old'} 老周666`,
          senderId: '4321',
          username: '周恩申是大帅哥',
          date: '8.26',
          timestamp: `10:2${i % 9}`,
          new: true
        })
      }
      if (reset) {
        messages.push({
          _id: this.messages.length,
          username: 'Conroy',
          content: 'zhoues宇宙第一帅',
          senderId: '1234',
          timestamp: '13:14',
          date: '8.26',
          new: true
        })
      }
      return messages
    },

    sendMessage(message) {
      this.newSocket.send(JSON.stringify(message));
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: this.nowDate()
        }
      ]
    },

    addNewMessage() {
      setTimeout(() => {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            username: 'ADK',
            content: '收到收到',
            senderId: '4441',
            timestamp: new Date().toString().substring(16, 21),
            date: this.nowDate()
          }
        ]
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.window-container {
  width: 96%;
  border-radius: 15px;
  margin-top: 13vh;
}

.container {
  width: 1240px;
}

@media (max-width: 1280px) {
  .container {
    width: 1024px;
  }
}

@media (max-width: 600px) {
  .container {
    width: unset;
    min-width: 320px;
  }
}

.container {
  margin: auto;
  padding: 0 20px;
}

form {
  padding-bottom: 20px;
}

input {
  padding: 5px;
  width: 140px;
  height: 21px;
  border-radius: 4px;
  border: 1px solid #d2d6da;
  outline: none;
  font-size: 14px;
  vertical-align: middle;

  &::placeholder {
    color: #9ca6af;
  }
}

button {
  background: #1976d2;
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  &:disabled {
    cursor: initial;
    background: #c6c9cc;
    opacity: 0.6;
  }
}

.button-cancel {
  color: #a8aeb3;
  background: none;
  margin-left: 5px;
}

select {
  vertical-align: middle;
  height: 33px;
  width: 152px;
  font-size: 13px;
  margin: 0 !important;
}

body {
  font-family: 'Quicksand', sans-serif;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
</style>