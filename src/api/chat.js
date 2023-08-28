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
		url: 'chat/send_text',
		method: 'post',
		data: data
	})
}
