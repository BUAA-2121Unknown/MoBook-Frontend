import { ElMessage as Message } from 'element-plus'

export default function toast(message = '', type = 'error', duration = 1500) {
  Message({
    message,
    type,
    duration,
  })
}
