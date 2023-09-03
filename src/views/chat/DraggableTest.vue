<template>
	<el-dialog v-model="dialogVisible" :modal=false width="40%" draggable top="5px" destroy-on-close="true"
		style="background-color:rgb(244, 244, 244);box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);">
		<template #header>
			<span class="dialog-header">
				聊天记录
			</span>
		</template>
		<el-divider style="margin-top:-20px" border-style="double" />
		<div class="message-list-show">
			<div v-for="message in chatMessageList">
				<MessageTemplate :messageList="message">
				</MessageTemplate>
				<el-divider />
			</div>
		</div>
	</el-dialog>
</template>

<script>
import MessageTemplate from './messageTemplate.vue';
import emitter from '@/utils/emitter'
import { requireMessageList } from '@/api/chat'
import { useUserStore } from '@/stores/modules/user'
export default {
	components: {
		MessageTemplate,
	},
	mounted() {
		emitter.on('openDialog', (messagesList) => this.openDialog(messagesList));
		emitter.on('closeDialog', (flag) => this.closeDialog(flag));
	},
	data() {
		return {
			dialogVisible: false,
			chatMessageList: [],
		};
	},
	methods: {
		openDialog(messagesList) {
			this.dialogVisible = false;
			console.log("开始请求聊天记录列表 1 ：", messagesList)
			this.loadMessageList(messagesList);
			this.dialogVisible = true;
		},
		closeDialog(flag) {
			this.dialogVisible = false;
		},
		//建立http链接 发送消息要求更新聊天记录列表
		async loadMessageList(messagesList) {
			try {
				const res = await requireMessageList({
					"org_id": useUserStore().orgId,
					"son_list": messagesList,
				});
				this.chatMessageList = res.data.message_list;
				console.log('聊天记录列表:', this.chatMessageList)
			} catch (e) {
				console.log(e)
			}
		},
	},
};
</script>

<style scoped>
.custom {
	background-color: rgb(138, 138, 138);
}

.dialog-header {
	font-family: Arial, sans-serif;
	font-size: 18px;
	font-weight: bold;
	color: #333333;
}


.message-list-show {
	height: 600px;
	background-color: rgb(244, 244, 244);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	overflow-y: auto;
}
</style>