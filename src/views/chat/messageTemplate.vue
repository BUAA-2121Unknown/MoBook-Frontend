<script  setup>

</script>

<template>
	<div class="message-demo-block">
		<div class="message-demo-avatar">
			<el-image style="width: 40px; height: 40px; border-radius: 5px;" :src="this.url" :zoom-rate="1.2" :initial-index="4"
				fit="cover" />
		</div>
		<div class="message-demo-name">
			<span class="name-text">{{ this.name }}</span>
		</div>
		<div class="message-demo-time">
			<span class="time-text">{{ this.time }}</span>
		</div>
		<div class="message-demo-content">
			<span class="content-text">
				{{ this.content }}
			</span>
			<!-- <el-image style="width:400px; height: 280px;" :src="image" :zoom-rate="1.2" :preview-src-list="srcList"
				fit="scale-down" /> -->
			<!-- <vue3VideoPlay v-bind="options" poster='https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/ironMan.jpg' /> -->

			<!-- <div class="message-demo-content-file" @click="openFile(this.fileUrl)">
				<el-image style="width: 110px; height: 110px; margin-top: 5px;margin-left: 5px;"
					src="https://img.sj33.cn/uploads/202010/7-20100410005BR.jpg" :fit="fit" />
				<div class="file-name-text">
					<span class="file-name-text-style">军事理论.doc</span>
				</div>
				<div class="file-tag-moBook">
					<span style="font-size: 12px;color: #949494;">墨书文件</span>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script >
import { reactive } from 'vue';
export default {
	props: {
		// value: Boolean,
	},
	data() {
		return {
			options: reactive({
				width: '360px', //播放器高度
				height: '240px', //播放器高度
				color: "#409eff", //主题色
				title: '', //视频名称
				src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4", //视频源
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
			content: '妈 我在外边打工好累啊，我只是一个戴着帽子的僵尸，每次冲锋都是我走在前面，我们公司大老板僵王告诉我要努力这样我才能升级加薪，血量才能变多，妈今天我们公司又来攻打植物了，豌豆的种子一颗一颗打在我身上，好疼啊，妈妈，但是我又觉得他们没有错。小时候总是在爸爸的肩膀上看着同村的叔叔阿姨往前冲，现在我长大了，进公司了，本想着能换个方式活着，不用像你们那么累了，但是妈妈，我发现我好像还是重复走着以前的路，爸爸妈妈，今天我又要去打工了，老板今天下了死命令，让我吃到戴夫家的脑子，又是我一个人冲锋，我的面前有一排排的坚果，妈妈你总说我高，但是他们比我还高，我戴着帽子努力的吃，但是感觉好无力，公司里没有人来帮我妈妈，我吃的好撑，小时候您总告诉我不要吃撑了。妈妈，钱好难挣啊，脑子好难吃啊，妈妈给您写这段话的时候我还在吃着第一颗坚果，小时候您带我补的牙都掉了妈妈，妈妈我的嘴吃的好疼啊，我看到植物栏上有好多灰烬植物妈妈，妈妈我好害怕，我不知道这些植物会不会用到我身上，妈妈先不说了，我要快点吃了，不然老板会扣我工资的。妈妈再见，安康，爱你的帽帽。',
			time: '08-31 20:44',
			name: '秋子夜',
			url: 'https://picx.zhimg.com/80/v2-751e1e7b100ac74d741f6095096e7d43_720w.webp?source=1940ef5c',
			image: 'https://pic2.zhimg.com/v2-dc5eda37f0dc2990c81107be154c4b29_r.jpg',
			// image: 'https://th.bing.com/th?id=OIP.j1QJ73AX7jMZhltZ35RLLAHaG-&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
			srcList: ['https://pic2.zhimg.com/v2-dc5eda37f0dc2990c81107be154c4b29_r.jpg'],
			fileUrl: 'https://www.gjtool.cn/pdfh5/git.pdf',
		};
	},
	methods: {
		openFile(fileUrl) {
			window.open(fileUrl, '_blank');
		}
	}
}
</script>
<style scoped>
.file-tag-moBook {
	position: absolute;
	bottom: 5px;
	right: 140px;
}

.file-name-text-style {
	font-size: 21px;
}

.file-name-text {
	position: absolute;
	top: 20px;
	left: 120px;
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
	width: 320px;
	height: 120px;
	background-color: #ffffff;
	border-radius: 10px;
	cursor: pointer;
}

.message-demo-time {
	position: absolute;
	display: flex;
	top: 7px;
	right: 10px;
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
	position: absolute;
	display: flex;
	top: 7px;
	left: 60px;
	max-width: 300px;
	height: 25px;
	background-color: #c3e6db30;
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
	position: absolute;
	margin-top: -400px;
	margin-left: 500px;
	width: 540px;
	background-color: #ebebeb;
}

.message-demo-content {
	margin-top: -8px;
	position: relative;
	width: 450px;
	left: 60px;
	background-color: transparent;
	margin-bottom: 10px;
}

.content-text {
	position: relative;
	font-size: 15px;
	color: rgb(53, 53, 53);
	font-family: Helvetica, sans-serif;
}
</style>
