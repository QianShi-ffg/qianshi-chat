import request from './request'

export function chat(data) {
    return request.post('https://oss.xingyijun.cn/chat', data)
}