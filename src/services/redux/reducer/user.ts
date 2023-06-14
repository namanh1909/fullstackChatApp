import { Action, GET_USER, GET_USER_SUSCESS } from "../actionType"


let initState = {
    userList: [],
    isLoading: false
}

export default (state: any = initState, action: Action) => {
    switch (action.type) {
        case GET_USER: {
            return {
                ...state
            }
        }
        case GET_USER_SUSCESS: {
            return {
                userList: action.payload.userList,
                isLoading: false

            }
        }

        case "USER_LIST_LOADING": {
            return {
                ...state,
                isLoading: true
            }
        }

        default: {
            return initState
        }
    }
}