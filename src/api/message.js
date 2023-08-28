import service from '@/utils/request'
import { fmtForm } from '@/utils/common'

export const getMessage = (data) => {
    const form = [
        'orgId',
        'status',
    ]
    return service({
        url: 'notif/all',
        method: 'post',
        data: fmtForm(data, form)
    })
}

export const editMessage = (data) => {
    const form = [
        'status',
        'notifications',
    ]
    return service({
        url: 'notif/update',
        method: 'post',
        data: fmtForm(data, form)
    })
}