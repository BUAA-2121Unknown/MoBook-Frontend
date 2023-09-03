import service from '@/utils/request'
import { fmtForm } from '@/utils/common'

export const requestChatList = (data) => {
	return service({
		url: 'chat/index',
		method: 'post',
		data: data
	})
}

export const requestRoomMessage = (data) => {
	return service({
		url: 'chat/get_all_messages',
		method: 'post',
		data: data
	})
}

export const requestSendMessage = (data) => {
	return service({
		url: 'chat/send_message',
		method: 'post',
		data: data
	})
}

export const requestSendFile = (data) => {
	return service({
		headers: { 'Content-Type': 'multipart/form-data' },
		url: 'chat/send_message',
		method: 'post',
		data: data
	})
}

export const requestChatRoom = (data) => {
	return service({
		url: 'chat/create',
		method: 'post',
		data: data
	})
}


export const requireForwardMessages = (data) => {
	return service({
		url: 'chat/transmit',
		method: 'post',
		data: data
	})
}

export const requireMessageList = (data) => {
	return service({
		url: 'chat/get_record_content',
		method: 'post',
		data: data
	})
}

export const inviteMember = (data) => {
	return service({
		url: 'chat/invite',
		method: 'post',
		data: data
	})
}



export const removeMember = (data) => {
	return service({
		url: 'chat/remove',
		method: 'post',
		data: data
	})
}

export const dismissRoom = (data) => {
	return service({
		url: 'chat/dismiss',
		method: 'post',
		data: data
	})
}