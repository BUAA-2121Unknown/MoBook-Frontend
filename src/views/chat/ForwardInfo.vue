<template>
	<div class="forward-info-block" @click="viewMessages()">
		<div class="forward-info-block-up">
			<span>{{ this.content }}</span>
		</div>
		<div class="forward-info-block-down">
			<span>查看详情</span>
		</div>
	</div>
</template>

<script>
import emitter from '@/utils/emitter'
export default {
	props: {
		content: String,
		son_list: Array,
	},
	data() {
		return {

		}
	},
	methods: {
		viewMessages() {
			emitter.emit('openDialog', this.son_list);
		}
	}
}
</script>

<style scoped>
.forward-info-block {
	width: 240px;
	height: 80px;
	background-color: #d2b7b7;
	border-radius: 5px;
	cursor: pointer;
}

.forward-info-block-up {
	border-radius: 5px 5px 0 0;
	width: 230px;
	height: 50px;
	display: flex;
	font-size: 16px;
	font-size: medium;
	align-items: center;
	/* 垂直居中 */
	margin-left: 0px;
	padding: 5px;
	text-align: center;
	background-color: rgb(238, 238, 238);
	border: 0.01px solid #c8c8c8;
	/* 2像素宽的黑色边框 */
	box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
}

.forward-info-block-down {
	width: 240px;
	height: 20px;
	border-radius: 0 0 5px 5px;
	background-color: rgb(203, 203, 203);
	align-items: center;
	/* 垂直居中 */
	margin-left: 0px;
	display: flex;
	text-align: center;
	justify-content: center;
	/* 水平居中 */
	align-items: center;
	/* 垂直居中 */
	font-size: 12px;
	border: 0.01px solid #c8c8c8;
	/* 2像素宽的黑色边框 */
	box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
}

.forward-info-block-down span {
	padding-right: 180px;
	/* 添加左侧内边距，控制文本偏移 */
}
</style>
