import { GET_MESSAGE, SEND_MESSAGE } from "../actionType";



export const getMessage = (content: any, groupId: any) => ({
    type: GET_MESSAGE,
    payload: {
        content,
        groupId
    }
})

export const sendMessage = (content: any, groupId: any) => ({
    type: SEND_MESSAGE,
    payload: {
        content,
        groupId
    }
})