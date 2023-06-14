import {
    CREATE_ROOM, CREATE_ROOM_SUSCESS, DELETE_ROOM,
    GET_LIST_ROOM, GET_LIST_ROOM_SUSCESS, LEAVE_ROOM, SAVE_ROOM, CHAT_ROOM_UPDATE, GET_ROOM_SELECT,
} from "../actionType"




export const getListRoom = () => ({
    type: GET_LIST_ROOM,
})

export const deleteRoom = () => ({
    type: DELETE_ROOM,

})

export const createRoom = () => ({
    type: CREATE_ROOM,
})

export const saveRoomChat = (listSelect: any, name: string) => ({
    type: SAVE_ROOM,
    payload: {
        listSelect,
        name
    }
})

export const createSuscess = (id: any) => ({
    type: CREATE_ROOM_SUSCESS,
    payload: {
        id
    }
})

export const getListSuscess = (items: any) => ({
    type: GET_LIST_ROOM_SUSCESS,
    payload: {
        items
    }
})

export const leaveGroup = () => ({
    type: LEAVE_ROOM
})

export const chatRoomsUpdated = (data: any) => ({
    type: CHAT_ROOM_UPDATE,
    payload: data,
});

export const getSelectRoom = (item: any) => ({
    type: GET_ROOM_SELECT,
    payload: { item }
})



