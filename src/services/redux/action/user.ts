import { GET_USER, GET_USER_SUSCESS } from "../actionType";


export const getUserList = () => ({
    type: GET_USER,
})

export const getUserListSucess = (item: any) => ({
    type: GET_USER_SUSCESS,
    payload: {
        userList: item
    }
})