import { GET_ID_ROOM, GET_ROOM_BY_ID, GET_ROOM_CHAT_DETAIL, GET_ROOM_DETAIL_ID, GET_ROOM_DETAIL_ID_UPDATE } from "../actionType";


export const getRoomById = (id: any) => ({
    type: GET_ROOM_DETAIL_ID,
    payload: {
        id
    }
})

export const getDetailRoomChat = () => ({
    type: GET_ROOM_CHAT_DETAIL
})

export const getRoomDetalSuscess = (item: any) => ({
    type: GET_ROOM_DETAIL_ID_UPDATE,
    payload: {
        item
    }
})