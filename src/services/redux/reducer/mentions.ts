import { stat } from "react-native-fs"
import { Action, DELETE_MENTION, GET_ID_MENTIONS, GET_LIST_MENTIONS_USER, GET_MENTIONS, GET_MENTIONS_SUSCESS, MENTION_UPDATE, SEND_MENTIONS } from "../actionType"


let initState = {
    mentionsList: [],
    idMentions: null,
    listRoomDetail: [],
    listUserMention: [],
    name: '',
    messages: '',
    listMembers: [],
    item: [],
    isLoading: false

}

export default (state: any = initState, action: Action) => {
    switch (action.type) {
        case GET_MENTIONS: {
            return {
                ...state
            }

        }

        case "MENTIONS_LOADING": {
            return {
                ...state,
                isLoading: true,
            }
        }

        case "MENTIONS_NULL_VALUE": {
            return {
                ...state,
                isLoading: false,
            }
        }

        case GET_MENTIONS_SUSCESS: {
            return {
                mentionsList: action.payload.item
            }

        }

        case MENTION_UPDATE:
            return {
                ...state,
                mentionsList: action.payload,
                isLoading: false,
            };

        case GET_ID_MENTIONS: {
            return {
                ...state,
                idMentions: action.payload.id
            }
        }

        case GET_LIST_MENTIONS_USER: {
            return {
                ...state,
                listUserMention: action.payload.user,
                name: action.payload.name,
                messages: action.payload.message,
                listMembers: action.payload.listMember,
                item: action.payload.item,
            }
        }

        case SEND_MENTIONS: {
            return {
                ...state,
                listUserMention: action.payload.user,
                name: action.payload.name,
                messages: action.payload.message,
                listMembers: action.payload.listMember,
                item: action.payload.item,
            }
        }

        default: {
            return initState
        }
    }
}
