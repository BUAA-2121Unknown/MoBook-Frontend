<script  setup>
import {
	Delete,
} from '@element-plus/icons-vue'
</script>
<template>
	<div class="list-element-block">
		<div style="width: 10px;"></div>
		<div class="image-block">
			<el-avatar shape="square" :size="40" :fit="cover" :src="this.avatar" />
		</div>
		<div class="list-element-name">
			<span>{{ this.name }}</span>
		</div>
		<el-button class="delete-button" type="info" :icon="Delete" size="small" circle @click="this.delete()" />
	</div>
</template>

<script>
import emitter from '@/utils/emitter'
export default {
	props: {
		id: String,
		avatar: String,
		name: String,
		// value: Boolean,
	},
	data() {
		return {
		};
	},
	methods: {
		delete() {
			emitter.emit('deleteSelectedUser', this.id);
			emitter.emit('changeIsChecked', this.id);
		}
	}
}
</script>

<style scoped>
.delete-button {
	border-radius: 20px !important;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 30px;
	/* background-color: rgb(224, 223, 223); */
}

.active {
	background-color: rgb(200, 200, 200);
}

.list-element-name {
	margin-left: 10px;
	max-height: 40px;
	max-width: 180px;
	background-color: transparent;
	margin-top: 7px;
	display: flex;
	align-items: center;
	font-size: 16px;
	font-weight: 540;
	letter-spacing: 0.5px;

}

.list-element-name span {
	margin-left: 0px;
	max-width: 160px;
	/* 添加额外的左边距 */
	white-space: nowrap;
	/* 防止文本换行 */
	overflow: hidden;
	/* 隐藏超出长度的部分 */
	text-overflow: ellipsis;
	/* 显示省略号 */
}

.image-block {
	margin-top: 7px;
	margin-left: 15px;
}

.list-element-block {
	margin-top: 1px;
	margin-left: 10px;
	width: 300px;
	height: 60px;
	cursor: pointer;
	border-radius: 2px;
	display: flex;
	float: left;
}
</style>
