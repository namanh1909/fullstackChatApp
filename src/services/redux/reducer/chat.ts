import { Action, DELETE_MESSAGE, GET_MESSAGE, SEND_MESSAGE } from "../actionType"

let initState = {
    message: "",
    groupId: "",
}
export default (state: any = initState, action: Action) => {
    switch (action.type) {
        case GET_MESSAGE: {
            return {
                message: action.payload.content,
                groupId: action.payload.groupId
            }
        }
        case SEND_MESSAGE: {
            return {
                ...state,
                message: action.payload.content,
                groupId: action.payload.groupId
            }
        }
        case DELETE_MESSAGE: {
            return {
                ...state
            }
        }
        default: return initState
    }
}