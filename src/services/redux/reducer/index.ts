import { combineReducers } from 'redux'
import auth from './auth'
import roomChat from './roomChat'
import chat from './chat'
import user from './user'
import mentions from './mentions'
import roomDetail from './roomDetail'
import uploadFile from './uploadFile'
import uploadImage from './uploadImage'

const rootReducer = combineReducers({
    auth,
    roomChat,
    chat,
    user,
    mentions,
    roomDetail,
    uploadFile,
    uploadImage
})

export default rootReducer