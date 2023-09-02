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
			<MessageTemplate :isContent="true" :isImage="false" :isVideo="false" :isFile="false"></MessageTemplate>
			<el-divider />
			<MessageTemplate :isContent="false" :isImage="true" :isVideo="false" :isFile="false"></MessageTemplate>
			<el-divider />
			<MessageTemplate :isContent="false" :isImage="false" :isVideo="true" :isFile="false"></MessageTemplate>
			<el-divider />
			<MessageTemplate :isContent="true" :isImage="false" :isVideo="false" :isFile="false"></MessageTemplate>
			<el-divider />
			<MessageTemplate :isContent="false" :isImage="false" :isVideo="false" :isFile="true"></MessageTemplate>
		</div>
	</el-dialog>
</template>

<script>
import MessageTemplate from './messageTemplate.vue';
import emitter from '@/utils/emitter'
export default {
	components: {
		MessageTemplate,
	},
	mounted() {
		emitter.on('openDialog', (flag) => this.openDialog(flag));
		emitter.on('closeDialog', (flag) => this.closeDialog(flag));
	},
	data() {
		return {
			num1: '1',
			num2: '2',
			num3: '3',
			num4: '4',
			dialogVisible: false,
			message: {
				_id: '7890',
				indexId: 12092,
				content: 'Message 1',
				senderId: '1234',
				username: 'John Doe',
				avatar: 'assets/imgs/doe.png',
				date: '13 November',
				timestamp: '10:20',
				system: false,
				saved: true,
				distributed: true,
				seen: true,
				deleted: false,
				failure: true,
				disableActions: false,
				disableReactions: false,
				files: [
					{
						name: 'My File',
						size: 67351,
						type: 'png',
						audio: true,
						duration: 14.4,
						url: 'https://firebasestorage.googleapis.com/...',
						preview: 'data:image/png;base64,iVBORw0KGgoAA...',
					}
				],
			},
		};
	},
	methods: {
		openDialog(flag) {
			this.dialogVisible = true;
		},
		closeDialog(flag) {
			this.dialogVisible = false;
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