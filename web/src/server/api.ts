import request from './request'

export function chat(data) {
    return request.post('https://localhost:8080/chat/freeAi', data)
}