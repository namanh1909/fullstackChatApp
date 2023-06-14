import { Action, LOGGIN_SUSCESS, LOGIN_FAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL, SAVE_USER } from "../actionType"

interface stateType {
    isLogin: boolean,
    error: boolean,
    isLoading: boolean,
    email: string | null,
    password: string | null,
    username: string | null
}

const initState = {
    user: null,
    isLogin: false,
    error: false,
    isLoading: false,
    email: "",
    password: "",
    username: "",
}

export default (state: stateType = initState, action: Action) => {
    switch (action.type) {
        case LOGGIN_SUSCESS: {
            return {
                ...state,
                isLogin: true,
            }
        }
        case LOGIN_WITH_GOOGLE: {
            return {
                ...state
            }
        }
        case SAVE_USER: {
            return {
                ...state,
                email: action.payload.email,
                password: action.payload.password,
                username: action.payload.username
            }
        }
        case LOGIN_FAIL: {
            return {
                ...state,
                error: true
            }
        }
        case LOGOUT: {
            return {
                user: null,
                isLogin: false,
                error: false,
                isLoading: false,
                email: "",
                password: "",
                username: "",
            }
        }
        case REGISTER_WITH_EMAIL: {
            return {
                ...state
            }
        }
        default: return initState
    }
}