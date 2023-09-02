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
      <el-select v-model="invitedUsername" placeholder="选择成员" class="remove-select" size="large" no-match-text="暂无相关结果"
        filterable clearable>
        <el-option class="option-user-select" v-for="user in inviteUsers" :key="user._id" :value="user._id">
          <el-avatar style="float: left; color: var(--el-text-color-secondary); " :src="user.avatar" />
          <span class="option-user-select-name">{{ user.username }}</span>
        </el-option>
      </el-select>
      <!-- <input v-model="invitedUsername" class="inputOp" type="text" placeholder="输入用户名" /> -->
      <button class="inviteUser" type="submit" :disabled="disableForm || !invitedUsername" @click="confirmInvite()">
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
      <el-select v-model="removeUserId" placeholder="选择成员" class="remove-select" size="large" no-match-text="暂无相关结果"
        filterable clearable>
        <el-option class="option-user-select" v-for="user in removeUsers" :key="user._id" :value="user._id">
          <el-avatar style="float: left; color: var(--el-text-color-secondary); " src="user.avatar" />
          <span class="option-user-select-name">{{ user.username }}</span>
        </el-option>
      </el-select>
      <button class="inviteUser" type="submit" :disabled="disableForm || !removeUserId" @click="confirmRemove()">
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
      <vue-advanced-chat ref="chatContainer" v-if="showComponent" height="calc(80vh - 20px)"
        :auto-scroll="JSON.stringify(autoScroll)" :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)"
        :load-first-room="false" :rooms-loaded="true" :messages="JSON.stringify(messages)"
        :menu-actions="JSON.stringify(menuActions)" :messages-loaded="messagesLoaded" :show-new-messages-divider="false"
        @send-message="sendMessage($event.detail[0])" @open-file="openFile($event.detail[0])"
        @fetch-messages="fetchMessages($event.detail[0])" @menu-action-handler="menuActionHandler($event.detail[0])"
        :text-messages="JSON.stringify(textDemo)" @add-room="createChatRoom($event.detail[0])"
        :message-selection-actions="JSON.stringify(messageSelectionActions)" :message-actions="JSON.stringify(messageOps)"
        :room-info-enabled="true" @room-info="showRoomInfo($event.detail[0])" :show-audio="false"
        @message-selection-action-handler="messageSelectionActionHandler($event.detail[0])">
      </vue-advanced-chat>
    </div>

    <!-- 逐条转发聊天记录弹窗 -->
    <div v-if="showSingle" class="forward-block">
      <div class="forward-block-left">
        <div class="forward-block-left-search">
          <form class="form">
            <button>
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <input class="input" placeholder="搜索" required="" type="text">
            <button class="reset" type="reset">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>
        </div>
        <div class="forward-block-left-list">
          <div class="forward-block-left-list-text">聊天列表</div>
          <div class="forward-block-left-list-true">
            <div class="inner-content">
              <listElementRoom v-for="room in this.rooms" :key="room.roomId" :id="room.roomId" :avatar="room.avatar"
                :name="room.roomName" />
            </div>
          </div>
        </div>
      </div>
      <div class="forward-block-right">
        <div class="forward-block-right-text">
          <span>分别发送给</span>
        </div>
        <div class="forward-block-right-list">
          <div class="select-content">
            <selectListRoom v-for="room in this.selectAllChoice" :key="room.roomId" :id="room.roomId"
              :avatar="room.avatar" :name="room.roomName" />
          </div>
        </div>
        <div class="right-divider">
          <el-divider border-style="inset" />
        </div>
        <div class="message-share-way">
          <ForwardInfo :content="ForwardName" :son_list="SonList"></ForwardInfo>
        </div>
        <div class="message-share-button">
          <el-button class="message-share-send" type="success" @click="confirmSingleForward()">发送 {{ listCount
          }}</el-button>
          <el-button class="message-share-cancel"
            @click="this.showSingle = false; this.selectAllChoice = [];">取消</el-button>
        </div>
      </div>
      <!-- <label class="container">
        <input type="checkbox" checked="checked">
        <div class="checkmark"></div>
      </label> -->
    </div>

    <!-- 合并转发聊天记录弹窗 -->
    <div v-if="showForwardMessages" class="forward-block">
      <div class="forward-block-left">
        <div class="forward-block-left-search">
          <form class="form">
            <button>
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <input class="input" placeholder="搜索" required="" type="text">
            <button class="reset" type="reset">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>
        </div>
        <div class="forward-block-left-list">
          <div class="forward-block-left-list-text">聊天列表</div>
          <div class="forward-block-left-list-true">
            <div class="inner-content">
              <listElementRoom v-for="room in this.rooms" :key="room.roomId" :id="room.roomId" :avatar="room.avatar"
                :name="room.roomName" />
            </div>
          </div>
        </div>
      </div>
      <div class="forward-block-right">
        <div class="forward-block-right-text">
          <span>分别发送给</span>
        </div>
        <div class="forward-block-right-list">
          <div class="select-content">
            <selectListRoom v-for="room in this.selectAllChoice" :key="room.roomId" :id="room.roomId"
              :avatar="room.avatar" :name="room.roomName" />
          </div>
        </div>
        <div class="right-divider">
          <el-divider border-style="inset" />
        </div>
        <div class="message-share-way">
          <ForwardInfo :content="ForwardName" :son_list="SonList"></ForwardInfo>
        </div>
        <div class="message-share-button">
          <el-button class="message-share-send" type="success" @click="confirmAllForward()">发送 {{ listCount
          }}</el-button>
          <el-button class="message-share-cancel"
            @click="this.showForwardMessages = false; this.selectAllChoice = [];">取消</el-button>
        </div>
      </div>
      <!-- <label class="container">
        <input type="checkbox" checked="checked">
        <div class="checkmark"></div>
      </label> -->
    </div>

    <!-- 创建聊天弹窗 -->
    <div v-if="createPage" class="forward-block">
      <div class="forward-block-left">
        <div class="forward-block-left-search">
          <form class="form">
            <button>
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <input class="input" v-model="createRoomInput" placeholder="搜索" required="" type="text"
              @input="handleCreateRoomInput(this.createRoomInput)">
            <button class="reset" type="reset">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>
        </div>
        <div class="forward-block-left-list">
          <div class="forward-block-left-list-text">列表</div>
          <div class="forward-block-left-list-true">
            <div class="inner-content">
              <listElement v-for="user in this.createChatUsers" :key="user._id" :id="user._id" :avatar="user.avatar"
                :name="user.username" />
            </div>
          </div>
        </div>
      </div>
      <div class="forward-block-right">
        <div class="forward-block-right-text">
          <span>选择联系人</span>
        </div>
        <div v-if="inviteCount">
          <span class="selectUserNum">已选择{{ inviteCount }}位联系人</span>
        </div>
        <div class="forward-block-right-list-createRoom">
          <div class="select-content-createRoom ">
            <selectList v-for="user in this.selectedUsers" :key="user._id" :id="user._id" :avatar="user.avatar"
              :name="user.username" />
          </div>
        </div>
        <div class="right-divider-createRoom">
          <el-divider border-style="inset" />
        </div>
        <div class="message-share-button">
          <el-button class="message-share-send" type="success" @click="this.beginChat()"
            :disabled="inviteCount == ''">开始聊天</el-button>
          <el-button class="message-share-cancel"
            @click="this.createPage = false; this.selectedUsers = [];">取消</el-button>
        </div>
      </div>
    </div>

    <div class="history-messages">
      <!-- <MessageTemplate></MessageTemplate> -->
      <DraggableTest></DraggableTest>
    </div>

    <!-- 确认删除当前房间 -->
    <div v-if="centerDialogVisible">
      <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
        <span class="confirmDelete">
          请您确认删除群聊 {{ this.room.roomName }} !
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmDismiss()">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

  </div>
</template>


<script>
import { register } from 'vue-advanced-chat'
import { requestChatList, requestRoomMessage, requestSendMessage, requestSendFile, dismissRoom, requestChatRoom, requireForwardMessages, inviteMember, removeMember } from '@/api/chat'
import { useUserStore } from '@/stores/modules/user'
// 
import selectList from './selectList.vue';
import ForwardInfo from './ForwardInfo.vue';
import listElement from './listElement.vue';

import selectListRoom from './selectListRoom.vue';
import listElementRoom from './listElementRoom.vue';

import MessageTemplate from './messageTemplate.vue';
import DraggableTest from './DraggableTest.vue'
import roomInfo from './roomInfo.vue'

import emitter from '@/utils/emitter'

// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()


export default {
  name: 'chat',
  components: {
    listElement,
    selectList,
    ForwardInfo,
    MessageTemplate,
    DraggableTest
  },
  data() {
    return {
      ForwardName: '',
      SonList: [],
      centerDialogVisible: false,
      createRoomInput: '',
      allMessages: [],
      autoScroll: {
        send: {
          new: true, // will scroll down after sending a message
          newAfterScrollUp: false // will not scroll down after sending a message when scrolled up
        },
        receive: {
          new: true, // will not scroll down when receiving a message
          newAfterScrollUp: false // will scroll down when receiving a message when scrolled up
        }
      },
      atId: "260",
      showForwardMessages: false,
      showSingle: false,
      selectedUsers: [
      ],
      // messagesPerPage: 20,
      textDemo: {
        ROOMS_EMPTY: '聊天列表为空',
        ROOM_EMPTY: '暂未选择聊天室',
        NEW_MESSAGES: '新消息',
        MESSAGE_DELETED: '消息已被删除',
        MESSAGES_EMPTY: '暂无消息',
        CONVERSATION_STARTED: '现在可以开始聊天了 ',
        TYPE_MESSAGE: '发送消息...',
        SEARCH: '搜索',
        IS_ONLINE: '在线',
        LAST_SEEN: '上次在线 ',
        IS_TYPING: '正在输入...',
        CANCEL_SELECT_MESSAGE: '取消'
      },
      messageSelectionActions: [
        {
          name: 'singleForwardMessages',
          title: '逐条转发'
        },
        {
          name: 'allForwardMessages',
          title: '合并转发',
        },
      ],
      messageOps: [
        {
          name: 'selectMessages',
          title: '多选',
        }
      ],
      disableForm: false,
      createPage: false,
      addRoomUsername: '',

      invitedUserId: '',
      inviteUsers: [],
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
      listLockReconnect: false,

      roomId: '',
      rooms: [
        // {
        //   roomId: '1',
        //   roomName: '不知名六人组',
        //   unreadCount: 4,
        //   index: 3,
        //   avatar: 'https://picx.zhimg.com/v2-7f2dbdcc084f3e70c135adc6e5406d33_r.jpg?source=1940ef5c',
        //   lastMessage: {
        //     _id: 'xyz',
        //     content: '大家加油冲冲冲',
        //     senderId: '7',
        //     username: '陈锐',
        //     timestamp: '23:19',
        //     saved: true,
        //     distributed: true,
        //     seen: true,
        //   },
        //   users: [
        //     { _id: '1234', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
        //     { _id: '1', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
        //     { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
        //     { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
        //     { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
        //     { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
        //   ],
        //   typingUsers: [7],
        // },
        // {
        //   roomId: '2',
        //   roomName: '软件工程课程群',
        //   unreadCount: 72,
        //   index: 2,
        //   avatar: 'https://pic1.zhimg.com/80/v2-b7cccb43cd10a9aa0e1ef079acfc150f_720w.webp?source=1940ef5c',
        //   lastMessage: {
        //     _id: 'xyz',
        //     content: '听我说，谢谢你，软件工程，你真好',
        //     senderId: '1234',
        //     username: 'zhoues',
        //     timestamp: '23:17',
        //     saved: true,
        //     distributed: true,
        //     seen: true,
        //   },
        //   users: [
        //     { _id: '7', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
        //     { _id: '1', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
        //     { _id: '4441', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
        //     { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
        //     { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
        //     { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },
        //   ],
        //   typingUsers: [7],
        // }
      ],
      room: '10',
      messages: [],
      messagesLoaded: false,
      allUsers: [{ _id: '7', username: 'cr', avatar: 'https://img2.woyaogexing.com/2023/08/26/8d02aed9994bd1e4b4b3a40678eafd3a.jpg' },
      { _id: '1', username: 'gahow', avatar: 'https://img2.woyaogexing.com/2023/08/26/e958b1689d603575d508a48239174022.png' },
      { _id: '3', username: 'czx', avatar: 'https://img2.woyaogexing.com/2023/08/26/2bba8400047a6648336119995180d4ad.jpg' },
      { _id: '4121', username: 'adk', avatar: 'https://img2.woyaogexing.com/2023/08/26/fbd06bd6e8e2e9ed4726869f98b97c40.jpg' },
      { _id: '4131', username: 'zdw', avatar: 'https://img2.woyaogexing.com/2023/08/26/1e4f1922fe9d26fd45a9453f8b7e5a23.png' },
      { _id: '4111', username: 'lzy', avatar: 'https://img2.woyaogexing.com/2023/08/26/c9aad630d56c60bdd3a421d4d593efb0.jpg' },],
      selectAllChoice: [],
      createChatUsers: [],
      forwardMessages: [],
    }
  },
  computed: {
    WebSocketUrl() {
      // websocket地址
      const userStore = useUserStore();
      const str = this.currentUserId + "/" + userStore.orgId + '/';
      // const str = "";
      return {
        url: "ws://82.156.25.78:5000/ws/chats/" + str,
      };
    },
    wsCfg() {
      // const userStore = useUserStore();
      // websocket地址
      const str = this.roomId + "/";
      // const str = "";
      return {
        url: "ws://82.156.25.78:5000/ws/chat/" + str,
      };
    },
    listCount() {
      return this.selectAllChoice.length === 0 ? '' : '(' + this.selectAllChoice.length + ')';
    },
    inviteCount() {
      return this.selectedUsers.length === 0 ? '' : this.selectedUsers.length;
    },
  },
  mounted() {
    // console.log("mounted");
    this.currentUserId = this.getCurrentUserId();
    this.requestMessages();
    this.createChatListWebSocket();

    // this.handleAt(this.$route.params.id, this.$route.params.roomId);
    // console.log(this.currentUserId);
    emitter.on('addSelectedUser', (userId) => this.addSelectedUser(userId));
    emitter.on('deleteSelectedUser', (userId) => this.deleteSelectedUser(userId));
    emitter.on('addSelectedRoom', (roomId) => this.addSelectedRoom(roomId));
    emitter.on('deleteSelectedRoom', (roomId) => this.deleteSelectedRoom(roomId));
    setTimeout(() => {
      this.handleAt(this.$route.params.id, this.$route.params.roomId);
    }, 400);

  },
  methods: {
    async confirmInvite() {
      if (this.invitedUsername != null) {
        const res = await inviteMember({ "org_id": useUserStore().orgId, "chat_id": this.room.roomId, "user_id": this.invitedUsername });
        console.log(res);
        this.inviteRoomId = null;
        this.invitedUsername = null
      }
    },
    async confirmRemove() {
      if (this.removeUserId != null) {
        const res = await removeMember({ "org_id": useUserStore().orgId, "chat_id": this.room.roomId, "user_id": this.removeUserId });
        console.log(res);
        this.removeUserId = null;
        this.removeRoomId = null
      }
    },
    async confirmDismiss() {
      const res = await dismissRoom({ "chat_id": this.room.roomId, });
      console.log(res);
      this.centerDialogVisible = false;
    },

    handleAt(id, roomId) {
      console.log('test', id, roomId)
      if (true) {
        // roomId = roomId.toString();
        // id = id.toString();
        console.log('test', id, roomId)
        setTimeout(() => {
          document.querySelector('vue-advanced-chat').shadowRoot.getElementById(roomId).click();
        }, 200);
        setTimeout(() => {
          document.querySelector('vue-advanced-chat').shadowRoot.getElementById(id).scrollIntoView({ behavior: "smooth" });
          console.log(element)
        }, 3000);
      }
    },
    handleCreateRoomInput(input) {

    },
    // 开始请求创建聊天
    async beginChat() {
      console.log("开始请求创建聊天", this.createChatUsers);
      try {
        const userStore = useUserStore()
        const res = await requestChatRoom({ "org_id": userStore.orgId, "invite_list": this.selectedUsers });
        console.log(res)
        this.createPage = false;
        if (this.selectedUsers.length > 1) {
          this.createRoomSuccess();
        } else {
          this.createSingleChatSuccess();
        }
        this.selectedUsers = [];
      } catch (e) {
        console.log(e)
      }
    },
    createChatRoom() {
      const filteredUsers = this.allUsers.filter(user => user._id != this.currentUserId && user._id != '0');
      this.createChatUsers = filteredUsers;
      this.createPage = true;
      // console.log('filteredUsers:', filteredUsers);
    },
    addSelectedUser(userId) {
      const user = this.allUsers.find(user => user._id === userId);
      this.selectedUsers.push(user);
      console.log('加入用户：', userId);
    },
    addSelectedRoom(roomId) {
      const room = this.rooms.find(room => room.roomId == roomId);
      this.selectAllChoice.push(room);
      console.log('加入房间：', roomId);
    },
    deleteSelectedUser(userId) {
      if (this.selectedUsers != null) {
        const updatedUsers = this.selectedUsers.filter(user => user._id !== userId);
        this.selectedUsers = updatedUsers;
      }
      console.log('删除用户：', userId, this.selectedUsers);
    },
    deleteSelectedRoom(roomId) {
      if (this.selectAllChoice != null) {
        const updatedRooms = this.selectAllChoice.filter(room => room.roomId !== roomId);
        this.selectAllChoice = updatedRooms;
      }
      console.log('删除房间：', roomId, this.selectAllChoice);
    },
    messageSelectionActionHandler({ action, messages, roomId }) {
      switch (action.name) {
        case 'singleForwardMessages':
          this.singleForward({ messages, roomId });
          break;
        case 'allForwardMessages':
          this.allForward({ messages, roomId });
          break;
      }
    },
    singleForward({ messages, roomId }) {
      const selectAllChoice = this.selectAllChoice;
      const messageIds = [];
      const user = this.allUsers.find(user => user._id == this.currentUserId);
      for (let i = 0; i < messages.length; i++) {
        messageIds[i] = messages[i]._id;
      }
      // messageIds.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      messageIds.sort((a, b) => a - b);
      this.SonList = messageIds;
      this.ForwardName = '[ 逐条转发 ]';
      this.showForwardMessages = false;
      this.showSingle = true;
      this.forwardMessages = messages;
    },
    async confirmSingleForward() {
      const selectAllChoice = this.selectAllChoice;
      const messages = this.forwardMessages;
      const messageIds = this.SonList;
      const user = this.allUsers.find(user => user._id == this.currentUserId);
      for (let i = 0; i < messages.length; i++) {
        messages[i].senderId = user._id;
        messages[i].avatar = user.avatar;
        messages[i].username = user.username;
        messages[i].timestamp = new Date().toString().substring(16, 21);
        messages[i].date = this.nowDate();
        var tempId = this.messages[this.messages.length - 1]._id;
        messages[i]._id = (this.room.index + i + 1).toString();
      }
      const roomIds = [];
      for (let i = 0; i < selectAllChoice.length; i++) {
        roomIds[i] = selectAllChoice[i].roomId;
      }
      const isRoomIdExists = roomIds.includes(this.roomId);
      if (isRoomIdExists) {
        console.log('本地假转发');
        this.messages = [
          ...this.messages,
          ...messages
        ];
      }
      try {
        const userStore = useUserStore()
        const res = await requireForwardMessages({ "tar_list": roomIds, "message_list": messageIds, "org_id": userStore.orgId, "choice": 'separate' });
        console.log(res)
        this.selectAllChoice = [];
        this.forwardMessages = [];
        console.log('逐条转发成功！');
        this.showSingle = false;
        this.SonList = [];
        this.ForwardName = '';
      } catch (e) {
        console.log(e)
      }
    },
    allForward({ messages, roomId }) {
      const selectAllChoice = this.selectAllChoice;
      const messageIds = [];
      const user = this.allUsers.find(user => user._id == this.currentUserId);
      for (let i = 0; i < messages.length; i++) {
        messageIds[i] = messages[i]._id;
      }
      // messageIds.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      messageIds.sort((a, b) => a - b);
      this.SonList = messageIds;
      this.ForwardName = '[ 合并转发 ]';
      this.showSingle = false;
      this.showForwardMessages = true;
      this.forwardMessages = messages;
    },
    async confirmAllForward() {
      const messages = this.forwardMessages;
      const selectAllChoice = this.selectAllChoice;
      const messageIds = this.SonList;
      const user = this.allUsers.find(user => user._id == this.currentUserId);
      const tempMessage = {
        _id: (this.room.index + 1).toString(),
        senderId: user._id,
        content: '',
        avatar: user.avatar,
        username: user.username,
        timestamp: new Date().toString().substring(16, 21),
        date: this.nowDate(),
        files: [
          {
            name: '聊天记录',
            son_list: messageIds,
          }
        ],
      };
      console.log('合并信息：', tempMessage.files[0].son_list);
      tempMessage.files = this.formattedFiles(tempMessage.files);
      const roomIds = [];
      for (let i = 0; i < selectAllChoice.length; i++) {
        roomIds[i] = selectAllChoice[i].roomId;
      }
      const isRoomIdExists = roomIds.includes(this.roomId);
      if (isRoomIdExists) {
        console.log('本地假转发');
        this.messages = [
          ...this.messages,
          tempMessage
        ];
      }
      try {
        const userStore = useUserStore()
        const res = await requireForwardMessages({ "tar_list": roomIds, "message_list": messageIds, "org_id": userStore.orgId, "choice": 'combined' });
        console.log(res)
        this.selectAllChoice = [];
        this.forwardMessages = [];
        console.log('合并转发成功！');
        this.showForwardMessages = false;
        this.SonList = [];
        this.ForwardName = '';
      } catch (e) {
        console.log(e)
      }
    },
    inviteUser(roomId) {
      this.resetForms()
      this.inviteRoomId = roomId;
      const users = this.rooms.find(room => room.roomId === roomId).users;
      const filteredUsers = this.allUsers.filter(user => {
        // 检查用户的 id 是否存在于 users 中的元素的 id 中
        return !users.some(u => u._id == user._id) && user._id != '0';
      });
      console.log(filteredUsers);
      this.inviteUsers = filteredUsers;
    },
    removeUser(roomId) {
      this.resetForms()
      this.removeRoomId = roomId;
      this.removeUsers = this.rooms.find(room => room.roomId === roomId).users;
      this.removeUsers = this.removeUsers.filter(user => user._id != '0' && user._id != this.currentUserId);
    },
    deleteRoom(roomId) {
      console.log('计划删除群聊：', roomId);
      this.centerDialogVisible = true;
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
          this.inviteUser(roomId);
          break;
        case 'removeUser':
          this.removeUser(roomId);
          break;
        case 'deleteRoom':
          this.deleteRoom(roomId);
          break;
      }
    },
    showRoomInfo(room) {
      console.log('显示房间信息：', room);
    },
    // openFile({ file }) {
    //   window.open(file.file.url, '_blank')
    // },
    openFile({ file }) {
      if (file.file.son_list[0] != null) {
        const messagesList = file.file.son_list;
        console.log('try open Message');
        emitter.emit('openDialog', messagesList);
      } else {
        console.log(file);
        const downloadLink = document.createElement('a');
        downloadLink.href = file.file.url;
        downloadLink.target = '_blank';
        downloadLink.download = file.file.name; // 设置下载文件的名称
        downloadLink.click();
      }
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
        console.log('当前列表:', res);
        this.rooms = res.data.chat_list;//消息没有给发送人name，待修改bug
        // for (let i = 0; i < this.rooms.length; i++) {
        //   if (this.rooms[i].files[0] != null) {
        //     this.rooms[i].lastMessage.content = this.rooms[i].files[0].name
        //   }
        // }
        this.allUsers = res.data.all_users;
        // console.log('当前列表:', this.rooms)
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 请求当前房间聊天记录
    async requestRoom() {
      console.log("开始请求当前聊天室", this.roomId);
      // console.log(useUserStore().orgId)
      try {
        const userStore = useUserStore()
        // console.log('查看历史记录:', this.roomId, this.rooms.find(room => room.roomId == this.roomId).messages)
        // console.log('房间信息：', this.rooms);
        // if (this.rooms.find(room => room.roomId == this.roomId).messages[0]) {
        //   this.messages = this.rooms.find(room => room.roomId == this.roomId).messages;
        //   return;
        // }
        const res = await requestRoomMessage({ "chat_id": this.roomId, "org_id": userStore.orgId });
        const list = res.data.message_list;
        console.log(list)
        const messages = [];
        this.room = this.rooms.find(room => room.roomId === this.roomId);
        const users = res.data.users;
        const newArray = users.map(user => {
          return { ...user, _id: user._id.toString() };
        });
        this.rooms.find(room => room.roomId === this.roomId).users = newArray;
        // this.rooms.find(room => room.roomId === this.roomId).users = this.allUsers;
        console.log('user:', res.data.users)
        this.rooms.find(room => room.roomId === this.roomId).unreadCount = 0;
        this.messages = list;
        this.rooms.find(room => room.roomId == this.roomId).messages = list;
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
          "file": null,
          "at_list": [1],
          "chat_id": this.roomId,
          "extension": null,
        });
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    //建立http链接 发送文件要求更新数据库
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
          "chat_id": this.roomId,
          "text": null,
          "at_list": [1],
          "extension": file.file.extension,
        });
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    createChatListWebSocket() {
      try {
        // 创建Web Socket 连接
        const socket = new WebSocket(this.WebSocketUrl.url);
        // 初始化事件
        this.initChatListEventHandle(socket);
      } catch (e) {
        // 出错时重新连接
        this.reconnect(this.WebSocketUrl.url);
        console.log("尝试连接 chatList");
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
        console.log("尝试连接 room");
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
        // 业务逻辑处理
        // this.addNewMessage()
        const data = JSON.parse(msg.data).data;
        console.log('接收data:', data);
        // this.rooms.find(room => room.roomId == this.roomId).lastMessage = data;
        // this.rooms.find(room => room.roomId == this.roomId).lastMessage.content = data.content;
        // this.rooms.find(room => room.roomId == this.roomId).lastMessage.username = data.username
        // this.rooms.find(room => room.roomId == this.roomId).lastMessage.timestamp = data.timestamp;

        // if (data.senderId === this.currentUserId) {
        //   this.rooms.find(room => room.roomId === this.roomId).lastMessage.username = '';

        // }
        // if (data.files) {
        //   console.log(data.files[0].name)
        //   this.rooms.find(room => room.roomId === this.roomId).lastMessage.content = data.files[0].name;
        // }
        if (!(data.senderId == this.currentUserId)) {
          this.addNewMessage(data)
        }
      };
    },
    initChatListEventHandle(socket) {
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
        console.log('接收msg:', msg.data);
        const data = JSON.parse(msg.data);
        console.log('接收data list:', data);
        const room = data.room;
        const exist = this.rooms.some(item => item.roomId == room.roomId);
        if (exist) {

          this.rooms.find(item => item.roomId == room.roomId).index = room.index;
          if (room.files != null) {
            room.lastMessage.content = room.files[0].name;
          }

          this.rooms.find(item => item.roomId == room.roomId).lastMessage = room.lastMessage;
          if ((room.lastMessage.senderId == this.currentUserId)) {
            console.log('自己给自己发消息!')
            this.rooms.find(item => item.roomId == room.roomId).unreadCount = 0;
          } else this.rooms.find(item => item.roomId == room.roomId).unreadCount = room.unreadCount;
        } else {
          this.rooms.push(room);
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
    listReconnect() {
      if (this.listLockReconnect) {
        return;
      }
      this.listLockReconnect = true;

      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(() => {
        this.listLockReconnect = false;
        this.createWebSocket(this.WebSocketUrl.url);
      }, 2000);
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

    textareaActionHandler({ roomId, message }) {
      console.log('test begin:')
      // const element = document.getElementById('messages-list');
      // console.log(element);
      // console.log(document.documentElement);
      // this.goToAt();
    },

    fetchMessages({ room, options = {} }) {
      // console.log('loading room:', room);
      if (options.reset) {
        this.resetMessages()
      }
      this.messagesLoaded = false;
      this.roomId = room.roomId;
      // console.log('loading room:', room);
      this.createWebSocket();
      this.requestRoom()
      setTimeout(() => {
        this.messagesLoaded = true
      })
      // room.unreadCount = 0;
    },
    resetMessages() {
      this.messages = []
      this.messagesLoaded = false
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

    sendMessage({
      roomId, content, files, replyMessage, usersTag
    }) {
      const room = this.rooms.find(room => room.roomId === roomId);
      const user = room.users.find(user => user._id == this.currentUserId);
      console.log('当前房间消息');
      // console.log(user.avatar);
      const message = {
        _id: (room.index + 1).toString(),
        content: content,
        avatar: user.avatar,
        senderId: '' + this.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: this.nowDate(),
        system: false,
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

    async deleteMessage({ message, roomId }) {
      message.deleted = true;
      message.saved = false;
      message.distributed = false;
      message.seen = false;
      message.system = false;
      //告诉后端要做什么
    },
    createRoomSuccess() {
      ElMessage({
        showClose: true,
        message: '成功创建群聊！',
        type: 'success',
      });
    },
    createSingleChatSuccess() {
      ElMessage({
        showClose: true,
        message: '进入私聊频道！',
        type: 'success',
      });
    }

  },
  beforeDestroy() {
    console.log('组件关闭')

  },
}
</script>

<script setup>
import { ref } from 'vue';
import { onActivated, onDeactivated } from 'vue';
import { ElMessage } from 'element-plus';
const showComponent = ref(true);
onActivated(() => {
  showComponent.value = true;
})

onDeactivated(() => {
  showComponent.value = false;
})
</script>

<style lang="scss" scoped>
.vac-scroll-high-light {
  background-color: #ffffff !important;
  /* 初始背景色 */
  animation: highlight 0.6s !important;
}

@keyframes highlight {
  0% {
    background-color: #ffffff;
  }

  /* 初始背景色 */
  50% {
    background-color: rgb(254, 150, 71);
  }

  /* 变亮的背景色 */
  100% {
    background-color: #ffffff;
  }

  /* 变暗后恢复初始背景色 */
}

.vac-scroll-smooth {
  scroll-behavior: smooth;
}

.confirmDelete {
  // background-color: black;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 21px;
}

.history-messages {
  background-color: transparent;
}

.selectUserNum {
  position: absolute;
  margin-top: -16px;
  margin-left: 250px;
  color: #666666;
  font-size: 12px;
}

.option-user-select-name {
  float: right;
  color: #333333;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 15px;
  font-family: "Lato", sans-serif;
}

.option-user-select {
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  text-align: center;
  align-items: center;
}

.message-share-send {
  width: 140px;
}

.message-share-cancel {
  margin-left: 10px;
  width: 80px;
}

.message-share-button {
  margin-top: 15px;
  margin-left: 70px;
  width: 200px;
  height: 50px;
  background-color: transparent;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  display: flex;
  justify-content: space-between;
}

.message-share-way {
  width: 240px;
  margin-left: 50px;
  height: 80px;
  background-color: #888;
  margin-top: -10px;
  border-radius: 5px;
}

.right-divider {
  width: 280px;
  margin-left: 40px;
  margin-top: 40px;
}

.right-divider-createRoom {
  width: 280px;
  margin-left: 40px;
  margin-top: 25px;
}

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

.rounded-select .el-input,
.rounded-select .el-input__inner {
  border-radius: 25px;
  /* 调整圆润度 */
}

.rounded-select .el-input {
  background-color: #f5f5f5;
  /* 背景色 */
}

.rounded-select .el-input__inner::placeholder {
  color: #999;
  /* 占位符颜色 */
}

.rounded-select .el-select-dropdown {
  border-radius: 25px;
  /* 调整下拉框圆润度 */
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
}

.forward-block {
  width: 640px;
  height: 480px;
  background-color: #cbcbcb;
  position: absolute;
  margin-top: -530px;
  margin-left: 400px;
  z-index: 10;
  border-radius: 7px;
  display: flex;
  border: 0.1px solid #dadada;
  /* 2像素宽的黑色边框 */
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  /* 3像素的水平和垂直偏移，5像素的模糊，0.3的透明度黑色阴影 */
}

.forward-block-left {
  width: 280px;
  height: 480px;
  z-index: 11;
  background-color: #f3f3f3;
  border-radius: 7px 0 0 7px;
}

.forward-block-right {
  width: 360px;
  height: 480px;
  z-index: 11;
  background-color: #e3e3e3;
  border-radius: 0px 7px 7px 0px;
}

.forward-block-right-text {
  margin-top: 20px;
  width: 120px;
  height: 20px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  text-align: center;
  /* 可以移除这一行，不再需要 */
}

.forward-block-right-list {
  width: 320px;
  height: 210px;
  margin-left: 20px;
  background-color: transparent;
}


.forward-block-right-list-createRoom {
  width: 320px;
  height: 300px;
  margin-left: 20px;
  background-color: transparent;
}

.forward-block-left-search {
  width: 280px;
  height: 60px;
  background-color: transparent;
  border-radius: 7px 0 0 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forward-block-left-list {
  width: 280px;
  height: 420px;
  background-color: #f3f3f3;
  border-radius: 0px 0 0 7px;
}

.forward-block-left-list-text {
  width: 280px;
  height: 20px;
  background-color: #f3f3f3;
  font-size: 18px;
  padding-left: 24px;
  font-weight: bold;
}

.forward-block-left-list-true {
  width: 280px;
  height: 400px;
  background-color: #f3f3f3;
  border-radius: 0px 0 0 7px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.select-content {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-height: 210px;
  overflow-y: auto;
}


.select-content-createRoom {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.select-content::-webkit-scrollbar {
  width: 8px;
}

.select-content::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 8px;
}

.select-content::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}


.inner-content {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-height: 360px;
  overflow-y: auto;
}

.inner-content::-webkit-scrollbar {
  width: 8px;
}

.inner-content::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 8px;
}

.inner-content::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* From uiverse.io by @satyamchaudharydev */
/* removing default style of button */

.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}

/* styling of whole input container */
.form {
  --timing: 0.3s;
  --width-of-input: 200px;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #fff;
  --border-color: #2f2ee9;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}

/* styling of Input */
.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}



/* styling of animated border */
.form:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}

/* Hover on Input */
.form:focus-within {
  border-radius: var(--after-border-radius);
}

input:focus {
  outline: none;
}

/* here is code of animated border */
.form:focus-within:before {
  transform: scale(1);
}

/* styling of close button */
/* == you can click the close button to remove text == */
.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}

/* close button shown when typing */
input:not(:placeholder-shown)~.reset {
  opacity: 1;
  visibility: visible;
}

/* sizing svg icons */
.form svg {
  width: 17px;
  margin-top: 3px;
}
</style>