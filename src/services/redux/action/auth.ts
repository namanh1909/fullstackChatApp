import {
    LOGIN_WITH_EMAIL,
    LOGIN_WITH_GOOGLE,
    LOGIN_FAIL,
    LOGGIN_SUSCESS,
    LOGOUT, SAVE_USER, REGISTER_WITH_EMAIL, DELETE_ROOM, GET_ID_SELECT
} from "../actionType";

export const loginSuscess = () => ({
    type: LOGGIN_SUSCESS,
})

export const loginWithEmail = () => ({
    type: LOGIN_WITH_EMAIL,
})

export const RegisterWithEmail = () => ({
    type: REGISTER_WITH_EMAIL,
})

export const LoginFail = () => ({
    type: LOGIN_FAIL
})

export const LogOut = () => ({
    type: LOGOUT
})

export const saveUser = (email: string, password: string, username: string) => ({
    type: SAVE_USER,
    payload: {
        email, password, username
    }
})

export const LoginGoogle = () => ({
    type: LOGIN_WITH_GOOGLE
})

export const deleteRoomChat = () => ({
    type: DELETE_ROOM
})

export const getIdSelect = (id: any) => ({
    type: GET_ID_SELECT,
    payload: { id }
})