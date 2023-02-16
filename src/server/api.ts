import request from './request'

export function chat(data) {
    return request.post('http://localhost:3022/chat/freeAi', data)
}