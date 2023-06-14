import { all, fork, call, takeLatest } from "redux-saga/effects"
import { authSaga } from "./auth"
import { chatSaga, watchSelectAndUploadPDF } from "./chat"
import { mentionsSaga, watchMentionsUpdates } from "./mentions"
import { roomSaga, watchChatRoomsUpdates } from "./roomChat"
import { roomDetail } from "./roomDetail"
import { selectImage } from "./uploadImage"
import { userSaga } from "./user"

export function* rootSaga(): any {
    yield all([
        authSaga(),
        roomSaga(),
        chatSaga(),
        userSaga(),
        mentionsSaga(),
        roomDetail(),
        watchChatRoomsUpdates(),
        watchMentionsUpdates(),
        watchSelectAndUploadPDF(),
        selectImage()
    ])
}

