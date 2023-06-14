import { Action, GET_ROOM_CHAT_DETAIL, GET_ROOM_DETAIL_ID, GET_ROOM_DETAIL_ID_UPDATE } from "../actionType"


let initState = {
    listChat: [],
    roomId: null,
    isLoading: false
}

export default (state: any = initState, action: Action) => {
    switch (action.type) {
        case GET_ROOM_DETAIL_ID_UPDATE: {
            return {
                ...state,
                listChat: action.payload.item,
                isLoading: false,
            }
        }
        case GET_ROOM_DETAIL_ID: {
            return {
                roomId: action.payload.id
            }
        }
        case GET_ROOM_CHAT_DETAIL: {
            return {
                ...state
            }
        }

        case 'ROOM_DETAIL_LOADING': {
            return {
                ...state,
                isLoading: true
            }
        }


        default: return state
    }
}
