
<template>
  <div class="window-container" v-if="showComponent">
    <div v-if="showComponent">
      <vue-advanced-chat v-if="showComponent" height="calc(80vh - 20px)" :current-user-id="currentUserId"
        :rooms="JSON.stringify(rooms)" :load-first-room="false" :rooms-loaded="true" :messages="JSON.stringify(messages)"
        :messages-loaded="messagesLoaded" :show-new-messages-divider="false" @send-message="sendMessage($event.detail[0])"
        @fetch-messages="fetchMessages($event.detail[0])" />
    </div>
  </div>
</template>


<script>
import { register } from 'vue-advanced-chat'
import { requestChatList, requestRoomMessage, requestSendMessage } from '@/api/chat'
import { useUserStore } from '@/stores/modules/user'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()

export default {
  name: 'chat',
  data() {
    return {
      currentUserId: '',
      //实时连接
      newSocket: null,
      lockReconnect: false,
      wsCfg: {
        // websocket地址
        url: "ws://81.70.161.76:5000/ws/chat/10/"
      },
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
            senderId: '7',
            username: '陈锐',
            timestamp: '23:19',
            saved: true,
            distributed: true,
            seen: true,
          },
          users: [
            { _id: '1234', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
            { _id: '4321', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
            { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
            { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
            { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
            { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
          ],
          typingUsers: [7],
        },
        {
          roomId: '2',
          roomName: '软件工程课程群',
          unreadCount: 72,
          index: 2,
          avatar: 'https://pic1.zhimg.com/80/v2-b7cccb43cd10a9aa0e1ef079acfc150f_720w.webp?source=1940ef5c',
          lastMessage: {
            _id: 'xyz',
            content: '听我说，谢谢你，软件工程，你真好',
            senderId: '1234',
            username: 'zhoues',
            timestamp: '23:17',
            saved: true,
            distributed: true,
            seen: true,
          },
          users: [
            { _id: '7', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
            { _id: '4321', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
            { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
            { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
            { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
            { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
          ],
          // typingUsers: [7], 
        }
      ],
      messages: [],
      messagesLoaded: false,
      allUsers: [{ _id: '7', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
      { _id: '2', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
      { _id: '3', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
      { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
      { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
      { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },],

    }

  },
  mounted() {
    console.log("mounted");
    this.requestMessages();
    this.createWebSocket();
    this.currentUserId = this.getCurrentUserId();
    console.log(this.currentUserId);
  },
  methods: {
    getCurrentUserId() {
      const userStore = useUserStore()
      return userStore.userInfo.id
    },
    //建立http链接 请求当前列表聊天记录
    async requestMessages() {
      console.log("开始请求列表");
      try {
        const userStore = useUserStore()
        const res = await requestChatList({ "org_id": userStore.orgId });
        console.log(res)
        this.rooms = res.data.chat_list;
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 请求当前房间聊天记录
    async requestRoom() {
      console.log("开始请求当前聊天室");
      try {
        const userStore = useUserStore()
        const res = await requestRoomMessage({ "chat_id": 10, "org_id": userStore.orgId });
        const list = res.data.message_list;
        console.log(list)
        // const messages = [];
        // for (let i = 0; i < list.length; i++) {
        //   // messages[i].avatar = list[i].avatar;
        //   messages[i].content = list[i].content;
        //   messages[i].date = list[i].content;
        //   messages[i].distributed = list[i].distributed;
        //   messages[i].saved = list[i].saved;
        //   messages[i].seen = list[i].seen;
        //   messages[i].senderId = list[i].senderId;
        //   messages[i].timestamp = list[i].timestamp;
        //   messages[i].username = list[i].username;
        //   messages[i]._id = list[i]._id;
        // }
        this.rooms.find(room => room.roomId === this.roomId).users = res.data.users;
        this.rooms.find(room => room.roomId === this.roomId).unreadCount = 0;
        this.messages = list;
        console.log(list[30].senderId);
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 发送消息要求更新数据库
    async requestSendMessages(message) {
      console.log("开始发送消息");
      try {
        const res = await requestSendMessage({
          "type": 3,
          "org_id": 2,
          "text": message.content,
          "at_list": [1],
          "chat_id": 10
        });
        console.log(res)
      } catch (e) {
        console.log(e)
      }
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
        // this.addNewMessage()
        console.log(JSON.parse(msg.data))
        const data = JSON.parse(msg.data).data;
        // console.log(msg.data['data'])
        this.rooms.find(room => room.roomId === this.roomId).lastMessage = data;
        if (!(data.senderId === this.currentUserId)) {
          this.addNewMessage(data)
        }
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
      // console.log(this.messages)
      this.messagesLoaded = false;
      this.roomId = room.roomId;
      this.requestRoom()
      // room.unreadCount = 0;
      // setTimeout(() => {
      //   if (options.reset) {
      //     this.messages = this.addMessages(true)
      //     this.messagesLoaded = true
      //   } else {
      //     this.messages = [...this.addMessages(), ...this.messages]
      //     this.messagesLoaded = true
      //   }
      //   // this.addNewMessage()
      // })
    },

    addMessages(reset) {
      const messages = []

      for (let i = 0; i < 30; i++) {
        messages.push({
          _id: i,
          content: `${reset ? '' : 'old'} 老周666`,
          senderId: '4321',
          username: '周恩申是大帅哥',
          avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg',
          date: '8.26',
          timestamp: `10:2${i % 9}`,
          saved: true,
          distributed: true,
          seen: true,
        })
      }
      if (reset) {
        messages.push({
          _id: 40,
          username: 'Conroy',
          avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png',
          content: 'zhoues宇宙第一帅',
          senderId: '7',
          timestamp: '13:14',
          date: '8.26',
          saved: true,
          distributed: true,
          seen: true,
        })
      }
      return messages
    },

    sendMessage({ roomId, content, files, replyMessage, usersTag
    }) {
      const message = {
        _id: roomId,
        content: content,
        avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png',
        senderId: '' + this.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: this.nowDate(),
        system: false,
        saved: true,
        distributed: true,
        seen: true,
        disableActions: false,
        disableReactions: false,
        files: files,
        replyMessage: replyMessage,
        reactions: usersTag,
      };
      this.messages = [
        ...this.messages,
        message
      ];
      // console.log(usersTag);
      this.requestSendMessages(message);
      // this.newSocket.send(JSON.stringify(content));
    },

    addNewMessage(message) {
      this.messages = [
        ...this.messages,
        message
      ];
    }
  },
  beforeDestroy() {
    console.log('组件关闭')
    // 关闭 WebSocket 连接
    // if (this.newSocket && this.newSocket.readyState === WebSocket.OPEN) {
    //   this.newSocket.close();
    // }
    //   // 组件销毁之前的清理工作
    //   this.messagesLoaded = false
    //   this.newSocket = null
    //   this.lockReconnect = false
  },

}
</script>

<script setup>
import { ref } from 'vue';
import { onActivated, onDeactivated } from 'vue';

const showComponent = ref(true);

onActivated(() => {
  showComponent.value = true;
})

onDeactivated(() => {
  showComponent.value = false;
})
</script>

<style lang="scss" scoped>
.window-container {
  width: 95%;
  border-radius: 15px;
  margin-top: 13vh;
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

body {
  font-family: 'Quicksand', sans-serif;
}
</style>