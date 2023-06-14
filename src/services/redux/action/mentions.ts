import { DELETE_MENTION, GET_ID_MENTIONS, GET_LIST_MENTIONS_USER, GET_MENTIONS, GET_MENTIONS_SUSCESS, MENTION_UPDATE, SEND_MENTIONS } from "../actionType";


export const getMentions = () => ({
    type: GET_MENTIONS
})

export const getMentionsSuscess = (item: any) => ({
    type: GET_MENTIONS_SUSCESS,
    payload: {
        item
    }
})

export const getIdMentions = (id: any) => ({
    type: GET_ID_MENTIONS,
    payload: [
        id
    ]
})

export const getListMentionUser = (user: any, name: any, listMember: any, message: any, item: any) => ({
    type: GET_LIST_MENTIONS_USER,
    payload: {
        user, name, listMember, message, item
    }
})

export const deleteMention = () => ({
    type: DELETE_MENTION
})

export const mentionsUpdated = (data: any) => ({
    type: MENTION_UPDATE,
    payload: data,
});

export const sendMentions = (user: any, name: any, listMember: any, message: any, item: any) => ({
    type: SEND_MENTIONS,
    payload: {
        user, name, listMember, message, item
    }
})