
<template>
  <div class="window-container" v-if="showComponent">
    <form v-if="addNewRoom" @submit.prevent="createRoom">
      <input v-model="addRoomUsername" class="inputOp" type="text" placeholder="输入用户名" />
      <button type="submit" :disabled="disableForm || !addRoomUsername">
        创建聊天
      </button>
      <button class="button-cancel" @click="addNewRoom = false">取消</button>
    </form>

    <form v-if="inviteRoomId" @submit.prevent="addRoomUser">
      <input v-model="invitedUsername" class="inputOp" type="text" placeholder="输入用户名" />
      <button class="inviteUser" type="submit" :disabled="disableForm || !invitedUsername">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
        </svg>
        <div class="button-cancel-text">
          邀请成员
        </div>
      </button>
      <button class="button-cancel" @click="inviteRoomId = null">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
        </svg>
        <div class="button-cancel-text">
          取消
        </div>
      </button>
      <div style="height: 7px;"></div>
    </form>

    <form v-if="removeRoomId" @submit.prevent="deleteRoomUser">
      <!-- <select class="removeUser" v-model="removeUserId">
        <option default value="">选择成员</option>
        <option v-for="user in removeUsers" :key="user._id" :value="user._id">
          <div class="option-content">
            <img :src="user.avatar" alt="User Avatar" class="avatar">
            {{ user.username }}
          </div>
        </option>
      </select> -->
      <select id="single">
        <option default value="">选择成员</option>
        <option v-for="user in removeUsers" :key="user._id" :value="user._id">
          {{ user.username }}
        </option>
      </select>
      <button class="inviteUser" type="submit" :disabled="disableForm || !removeUserId">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
        </svg>
        <div class="button-cancel-text">
          移除成员
        </div>
      </button>
      <button class="button-cancel" @click="removeRoomId = null">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
        </svg>
        <div class="button-cancel-text">
          取消
        </div>
      </button>
      <div style="height: 7px;"></div>
    </form>

    <div v-if="showComponent">
      <vue-advanced-chat v-if="showComponent" height="calc(80vh - 20px)" :current-user-id="currentUserId"
        :rooms="JSON.stringify(rooms)" :load-first-room="false" :rooms-loaded="true" :messages="JSON.stringify(messages)"
        :room-actions="JSON.stringify(roomActions)" :menu-actions="JSON.stringify(menuActions)"
        :messages-loaded="messagesLoaded" :show-new-messages-divider="false" @send-message="sendMessage($event.detail[0])"
        @open-file="openFile($event.detail[0])" @fetch-messages="fetchMessages($event.detail[0])"
        @menu-action-handler="menuActionHandler($event.detail[0])" :text-messages="JSON.stringify(textDemo)">
      </vue-advanced-chat>
    </div>
  </div>
</template>


<script>
import { register } from 'vue-advanced-chat'
import { requestChatList, requestRoomMessage, requestSendMessage, requestSendFile } from '@/api/chat'
import { useUserStore } from '@/stores/modules/user'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()

export default {
  name: 'chat',
  data() {
    return {
      // messagesPerPage: 20,
      textDemo: {
        ROOMS_EMPTY: 'Rooms empty',
        ROOM_EMPTY: '暂未选择聊天室',
        NEW_MESSAGES: '新消息',
        MESSAGE_DELETED: 'Ce message a été supprimé',
        MESSAGES_EMPTY: '暂无消息',
        CONVERSATION_STARTED: '现在可以开始聊天了 ',
        TYPE_MESSAGE: '发送消息...',
        SEARCH: '搜索',
        IS_ONLINE: '在线',
        LAST_SEEN: 'dernière connexion ',
        IS_TYPING: '正在输入...',
        CANCEL_SELECT_MESSAGE: 'Annuler Sélection'
      },
      disableForm: false,
      addNewRoom: null,
      addRoomUsername: '',
      inviteRoomId: null,
      invitedUsername: '',
      removeRoomId: null,
      removeUserId: '',
      removeUsers: [],
      roomActions: [{
        name: 'archiveRoom',
        title: 'Archive Room'
      }],//房间列表操作
      menuActions: [
        {
          name: 'inviteUser',
          title: '邀请成员'
        },
        {
          name: 'removeUser',
          title: '移除成员'
        },
        {
          name: 'deleteRoom',
          title: '解散群聊'
        }],//房间邀请成员操作
      fileList: [],
      currentUserId: '',
      //实时连接
      newSocket: null,
      lockReconnect: false,
      wsCfg: {
        // websocket地址
        url: "ws://82.156.25.78:5000/ws/chat/10/"
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
    inviteUser(roomId) {
      this.resetForms()
      this.inviteRoomId = roomId
    },
    removeUser(roomId) {
      this.resetForms()
      this.removeRoomId = roomId
      this.removeUsers = this.rooms.find(room => room.roomId === roomId).users
    },
    resetForms() {
      this.disableForm = false
      this.addNewRoom = null
      this.addRoomUsername = ''
      this.inviteRoomId = null
      this.invitedUsername = ''
      this.removeRoomId = null
      this.removeUserId = ''
    },
    //聊天室的一些操作
    menuActionHandler({ action, roomId }) {
      switch (action.name) {
        case 'inviteUser':
          return this.inviteUser(roomId)
        case 'removeUser':
          return this.removeUser(roomId)
        // case 'deleteRoom':
        // return this.deleteRoom(roomId)
      }
    },
    // openFile({ file }) {
    //   window.open(file.file.url, '_blank')
    // },
    openFile({ file }) {
      console.log(file);
      const downloadLink = document.createElement('a');
      downloadLink.href = file.file.url;
      downloadLink.target = '_blank';
      downloadLink.download = file.file.name; // 设置下载文件的名称
      downloadLink.click();
    },

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
      // console.log(useUserStore().orgId)
      try {
        const userStore = useUserStore()
        const res = await requestRoomMessage({ "chat_id": 10, "org_id": userStore.orgId });
        const list = res.data.message_list;
        console.log(list)
        this.rooms.find(room => room.roomId === this.roomId).users = res.data.users;
        this.rooms.find(room => room.roomId === this.roomId).unreadCount = 0;
        this.messages = list;
        // console.log(list[30].senderId);
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 发送消息要求更新数据库
    async requestSendMessages(message) {
      console.log("开始发送消息");
      try {
        const res = await requestSendMessage({
          "org_id": useUserStore().orgId,
          "text": message.content,
          "file": '',
          "at_list": [1],
          "chat_id": 10,
          "extension": '',
        });
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 发送消息要求更新数据库
    async requestSendFiles(file) {
      console.log("开始发送文件", file);
      console.log(file.file.blob)
      const fileInfo = file.file

      const sendingFile = new File([fileInfo.blob], fileInfo.name, { type: fileInfo.type })
      console.log(file.file.extension)
      try {
        const res = await requestSendFile({
          "org_id": useUserStore().orgId,
          "file": sendingFile,
          "chat_id": 10,
          "text": '',
          "at_list": [1],
          "extension": file.file.extension,
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
        console.log('接收data:')
        console.log(JSON.parse(msg.data))
        const data = JSON.parse(msg.data).data;
        this.rooms.find(room => room.roomId === this.roomId).lastMessage = data;
        if (data.files) {
          console.log(data.files[0].name)
          this.rooms.find(room => room.roomId === this.roomId).lastMessage.content = data.files[0].name;
        }
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

      const formattedDate = `${month}-${day}`;
      return formattedDate
    },

    fetchMessages({ room, options = {} }) {
      // console.log(this.messages)
      this.messagesLoaded = false;
      this.roomId = room.roomId;
      this.requestRoom()
      // room.unreadCount = 0;
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
      const room = this.rooms.find(room => room.roomId === roomId);
      const user = room.users.find(user => user._id === this.currentUserId);
      // console.log('当前房间消息');
      // console.log(user.avatar);
      const message = {
        _id: roomId,
        content: content,
        avatar: user.avatar,
        senderId: '' + this.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: this.nowDate(),
        system: false,
        saved: true,
        distributed: true,
        seen: true,
        disableActions: false,
        disableReactions: false,
        replyMessage: replyMessage,
        reactions: usersTag,
      };
      if (content) {
        this.requestSendMessages(message);
      }
      if (files) {
        console.log('文件详情 格式化前：', files)
        message.files = this.formattedFiles(files);
        console.log('文件详情 格式化后：', message.files)
        for (let index = 0; index < files.length; index++) {
          this.requestSendFiles({ file: files[index] });
        }
      }

      this.messages = [
        ...this.messages,
        message
      ];
      // console.log(usersTag);
      // this.newSocket.send(JSON.stringify(content));
    },

    addNewMessage(message) {
      this.messages = [
        ...this.messages,
        message
      ];
    },

    //发送文件相关操作

    formattedFiles(files) {
      const formattedFiles = []

      files.forEach(file => {
        const messageFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl
        }

        if (file.audio) {
          messageFile.audio = true
          messageFile.duration = file.duration
        }

        formattedFiles.push(messageFile)
      })

      return formattedFiles
    },
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


.inviteUser {
  margin-top: 1px;
  margin-left: 9px;
  background-color: #576bdb;
  color: #000000;
  width: 9.6em;
  height: 3.2em;
  border: #ffffff 0.2em solid;
  border-radius: 11px;
  text-align: right;
  transition: all 0.6s ease;
}

.inputOp {
  height: 15px;
  width: 250px;
  border: none;
  outline: none;
  border-radius: 15px;
  padding: 1em;
  background-color: #ccc;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
  transition: 300ms ease-in-out;
}

.inputOp:focus {
  background-color: white;
  transform: scale(1.05);
  box-shadow: 13px 13px 100px #969696,
    -13px -13px 100px #ffffff;
}

.button-cancel {
  margin-top: 1px;
  background-color: #576bdb;
  color: #000000;
  width: 7.5em;
  height: 3.2em;
  border: #ffffff 0.2em solid;
  border-radius: 11px;
  text-align: right;
  transition: all 0.6s ease;
}

.button-cancel:hover {
  background-color: #3654ff;
  cursor: pointer;
}

.button-cancel svg {
  width: 1.6em;
  margin: -0.2em 0.8em 1em;
  position: absolute;
  display: flex;
  transition: all 0.6s ease;
}

.button-cancel:hover svg {
  transform: translateX(5px);
}

.button-cancel-text {
  margin: 0 1.5em
}

.inviteUser:hover {
  background-color: #3654ff;
  cursor: pointer;
}

.inviteUser svg {
  width: 1.6em;
  margin: -0.2em 0.8em 1em;
  position: absolute;
  display: flex;
  transition: all 0.6s ease;
}

.inviteUser:hover svg {
  transform: translateX(5px);
}

.button-cancel-text {
  margin: 0 1.5em
}

.removeUser {
  width: 120px;
  height: 3em;
  border-radius: 10px;
  text-align: center;
  background-color: #f0f0f0;
  /* 背景颜色 */
  border: 1px solid #ccc;
  /* 边框 */
  font-size: 14px;
  /* 字体大小 */
  color: #333;
  /* 字体颜色 */
  padding: 5px;
  /* 内边距 */
  appearance: none;
  /* 移除默认样式 */
  -webkit-appearance: none;
  /* 兼容性 */
}

.removeUser option {
  background-color: #fff;
  /* 选项背景颜色 */
  font-size: 14px;
  /* 字体大小 */
  color: #333;
  /* 字体颜色 */
  padding: 8px;
  /* 内边距 */
  border-bottom: 1px solid #ccc;
  /* 分隔线 */
}

.removeUser option:last-child {
  border-bottom: none;
  /* 最后一个选项取消分隔线 */
}
</style>