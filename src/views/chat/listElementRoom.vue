<template>
	<div :class="['list-element-block', { 'active': isChecked }]" @click="toSelect()">
		<div style="width: 10px;"></div>
		<label class="container">
			<input v-model="isChecked" type="checkbox" :disabled="true">
			<div class="checkmark"></div>
		</label>
		<div class="image-block">
			<el-avatar shape="square" :size="40" :fit="cover" :src="avatar" />
		</div>
		<div class="list-element-name">
			<span>{{ name }}</span>
		</div>
	</div>
</template>

<script>
import emitter from '@/utils/emitter'
export default {
	props: {
		id: String,
		avatar: String,
		name: String,
	},
	data() {
		return {
			isChecked: false,
			needDelete: true,
		};
	},
	computed: {

	},
	mounted() {
		emitter.on('changeIsCheckedRoom', (id) => this.changeIsCheckedRoom(id));
	},
	methods: {
		changeIsCheckedRoom(id) {
			if (id === this.id) {
				console.log('更改isChecked')
				this.needDelete = false;
				this.isChecked = !this.isChecked;
			}
		},
		toSelect() {
			this.isChecked = !this.isChecked;
		},
	},
	watch: {
		isChecked(newValue) {
			if (newValue) {
				emitter.emit('addSelectedRoom', this.id);
			} else {
				if (this.needDelete) {
					emitter.emit('deleteSelectedRoom', this.id);
				} else {
					this.needDelete = true;
				}
			}
		},
	}
}
</script>

<style scoped>
.active {
	background-color: rgb(200, 200, 200);
}

.list-element-name {
	margin-left: 10px;
	max-height: 40px;
	max-width: 140px;
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
	max-width: 140px;
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
	width: 260px;
	height: 60px;
	cursor: pointer;
	border-radius: 2px;
	display: flex;
	float: left;
}

/* Hide the default checkbox */
.container input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

.container {
	display: block;
	position: relative;
	cursor: pointer;
	font-size: 4.2rem;
	user-select: none;
	margin-top: 15px;
	margin-left: 5px;
	width: 24px;
	height: 24px;
}

/* Create a custom checkbox */
.checkmark {
	--clr: #0B6E4F;
	position: relative;
	top: 0;
	left: 0;
	height: 24px;
	width: 24px;
	background-color: #ccc;
	border-radius: 50%;
	transition: 300ms;
}

/* When the checkbox is checked, add a blue background */
.container input:checked~.checkmark {
	background-color: var(--clr);
	border-radius: .5rem;
	animation: pulse 500ms ease-in-out;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
	content: "";
	position: absolute;
	display: none;
}

/* Show the checkmark when checked */
.container input:checked~.checkmark:after {
	display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
	left: 0.64em;
	top: 0.27em;
	width: 0.35em;
	height: 0.6em;
	border: solid #E0E0E2;
	border-width: 0 0.15em 0.15em 0;
	transform: rotate(45deg);
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 #0B6E4F90;
		rotate: 20deg;
	}

	50% {
		rotate: -20deg;
	}

	75% {
		box-shadow: 0 0 0 10px #0B6E4F60;
	}

	100% {
		box-shadow: 0 0 0 13px #0B6E4F30;
		rotate: 0;
	}
}
</style>
