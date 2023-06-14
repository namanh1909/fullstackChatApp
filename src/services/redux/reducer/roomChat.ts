import { RoomChat } from "../../entities"
import {
    Action, CHAT_ROOM_LOADING, CHAT_ROOM_UPDATE, CREATE_ROOM, CREATE_ROOM_SUSCESS,
    DELETE_ROOM, GET_ID_SELECT, GET_LIST_ROOM,
    GET_LIST_ROOM_SUSCESS, GET_ROOM_SELECT, LEAVE_ROOM, SAVE_ROOM
} from "../actionType"


let initState = {
    roomList: [],
    newCreateId: "",
    listSelect: null,
    nameNewCreate: null,
    selectId: null,
    roomSelect: null,
    uploading: false,
    percentage: 0,
    downloadURL: '',
    isLoading: false,
}
export default (state: any = initState, action: Action) => {
    switch (action.type) {
        case GET_LIST_ROOM: {
            return {
                ...state,
            }
        }
        case DELETE_ROOM: {
            return {
                ...state,
            }
        }
        case CREATE_ROOM: {
            return {
                ...state
            }
        }
        case CHAT_ROOM_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }
        case CHAT_ROOM_UPDATE:
            return {
                ...state,
                roomList: action.payload,
                isLoading: false,
            };
        case SAVE_ROOM: {
            return {
                ...state,
                listSelect: action.payload.listSelect,
                nameNewCreate: action.payload.name
            }
        }
        case CREATE_ROOM_SUSCESS: {
            return {
                ...state,
                newCreateId: action.payload.id
            }
        }
        case GET_LIST_ROOM_SUSCESS: {
            console.log("state update", action.payload.items)
            return {
                ...state,
                roomList: state.roomList.length > 0 ? [...state.roomList, action.payload.items] : action.payload.items
            }
        }
        case DELETE_ROOM: {
            return {
                ...state
            }
        }
        case GET_ID_SELECT: {
            return {
                ...state,
                selectId: action.payload.id
            }
        }
        case LEAVE_ROOM: {
            return {
                ...state
            }
        }
        case GET_ROOM_SELECT: {
            return {
                ...state,
                roomSelect: action.payload.item
            }
        }
        case "CHAT_ROOM_NULL_DATA": {
            return {
                ...state,
                isLoading: false,
                roomList: []
            }
        }
        default: return initState
    }
}