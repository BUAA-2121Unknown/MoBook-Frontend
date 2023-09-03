<template>
	<div v-if="this.show" class="message-demo-block">
		<div class="message-demo-avatar">
			<el-image style="width: 40px; height: 40px; border-radius: 5px;" :src="url" :zoom-rate="1.2" :initial-index="4"
				fit="cover" />
		</div>
		<div class="message-demo-name">
			<span class="name-text">{{ this.messageList.name }}</span>
		</div>
		<div class="message-demo-time">
			<span class="time-text">{{ this.messageList.time }}</span>
		</div>
		<div class="message-demo-content">
			<span v-if="this.type == '0'" class="content-text">
				{{ this.content }}
			</span>
			<el-image v-if="this.type == '1'" :src="image" :zoom-rate="1.2" :preview-src-list="srcList" fit="scale-down" />

			<vue3VideoPlay v-if="this.type == '2'" v-bind="options" />

			<div v-if="this.type == '3'" class="message-demo-content-file" @click="openFile(this.fileUrl)">
				<el-image style="width: 110px; height: 110px; margin-top: 5px;margin-left: 5px;"
					src="https://img.sj33.cn/uploads/202010/7-20100410005BR.jpg" :fit="fit" />
				<div class="file-name-text">
					<span class="file-name-text-style">{{ this.filename }}</span>
				</div>
				<div class="file-tag-moBook">
					<span style="font-size: 12px;color: #949494;">墨书文件</span>
				</div>
			</div>

			<div v-if="this.type == '4'" class="message-demo-forward" @click="this.show = false">
				<ForwardInfo :content="content" :son_list="son_list"></ForwardInfo>
			</div>
		</div>
	</div>
</template>

<script >
import ForwardInfo from './ForwardInfo.vue';
import { reactive } from 'vue';
export default {
	props: {
		messageList: Array,
	},
	components: {
		ForwardInfo,
	},
	mounted() {
		// this.checkType(this.message);
		this.son_list = null;
		this.content = '';
		console.log('传递给子组件', this.messageList);
		this.type = this.messageList.message_type;
		this.messageId = this.messageList.messageId;
		this.url = this.messageList.avatar;
		this.chooseShow();
	},
	created() {
	},
	data() {
		return {
			show: true,
			son_list: [],
			messageId: '',
			type: '',
			options: reactive({
				width: '360px', //播放器高度
				height: '240px', //播放器高度
				color: "#409eff", //主题色
				title: '', //视频名称
				src: "", //视频源
				muted: false, //静音
				webFullScreen: false,
				speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
				autoPlay: false, //自动播放
				loop: false, //循环播放
				mirror: false, //镜像画面
				ligthOff: false,  //关灯模式
				volume: 0.3, //默认音量大小
				control: true, //是否显示控制
				controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'fullScreen'] //显示所有按钮,
			}),
			content: '或许有一天，你会把我们的故事与她诉说，好在山穷水尽之时遇见你，她虽教会你长大，却不是对的人，还总是上演机场与船的故事。  三五成群的日子并不是很多，即使缘分使之相遇，又突然分道扬镳，只剩下那些未完成的梦，和你走过的路，最后青春也只属于一场放肆。',
			url: '',
			image: '',
			srcList: [],
			fileUrl: 'https://www.gjtool.cn/pdfh5/git.pdf',
			filename: '',
		};
	},
	methods: {
		openFile(fileUrl) {
			window.open(fileUrl, '_blank');
		},
		chooseShow() {
			if (this.type == '0') {
				this.content = this.messageList.content;
			} else if (this.type == '1') {
				this.image = this.messageList.image;
				this.srcList.push(this.image);
			} else if (this.type == '2') {
				this.options.src = this.messageList.src;
			} else if (this.type == '3') {
				this.fileUrl = this.messageList.fileUrl;
				this.filename = this.messageList.filename;
			} else if (this.type == '4') {
				this.content = this.messageList.content;
				this.son_list = this.messageList.son_list;
			}
		}
	}
}
</script>
<style scoped>
.message-demo-forward {
	border-radius: 5px;
	background-color: transparent;
	width: 240px;
	height: 80px;
	cursor: pointer;
}

/* .message-demo-forward-up {
	width: 210px;
	background-color: rgb(179, 179, 179);
} */

.file-tag-moBook {
	position: absolute;
	display: flex;
	bottom: 10px;
	margin-left: 250px
}

.file-name-text-style {
	font-size: 21px;
}

.file-name-text {
	position: relative;
	top: -100px;
	left: 110px;
	max-width: 180px;
	max-height: 60px;
	background-color: #ffffff;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
}

.message-demo-content-file {
	position: relative;
	width: 320px;
	height: 120px;
	background-color: #ffffff;
	border-radius: 10px;
	cursor: pointer;
}

.message-demo-time {
	position: relative;
	display: flex;
	top: -70px;
	right: -450px;
	width: 90px;
	height: 25px;
	background-color: transparent;
	text-align: center;
	align-items: center;
	justify-content: center;

}

.time-text {
	font-size: 12px;
	color: #9f9f9f;
}

.name-text {
	font-family: Arial, sans-serif;
	font-size: 18px;
	font-weight: bold;
	color: #333333;
}

.message-demo-name {
	position: relative;
	display: flex;
	top: -42px;
	left: 60px;
	max-width: 300px;
	height: 25px;
	background-color: transparent;
	text-align: center;
	align-items: center;
	/* 添加额外的左边距 */
	white-space: nowrap;
	/* 防止文本换行 */
	overflow: hidden;
	/* 隐藏超出长度的部分 */
	text-overflow: ellipsis;
	/* 显示省略号 */
}

.message-demo-avatar {
	margin-top: 5px;
	margin-left: 10px;
	border-radius: 5px;
}

.message-demo-block {
	/* margin-top: -400px;
	margin-left: 500px; */
	width: 540px;
	background-color: transparent;
}

.message-demo-content {
	position: relative;
	margin-top: -60px;
	width: 450px;
	left: 60px;
	background-color: transparent;
}

.content-text {
	position: relative;
	font-size: 15px;
	color: rgb(53, 53, 53);
	font-family: Helvetica, sans-serif;
}
</style>
