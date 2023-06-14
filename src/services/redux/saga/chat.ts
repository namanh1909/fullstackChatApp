import { all, select, takeEvery, put, call, take, takeLatest } from "redux-saga/effects";
import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { v4 as uuidv4 } from 'uuid';
import { SEND_MESSAGE, } from "../actionType";
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import { uploadingError, uploadingFinished, uploadingProgress, uploadingStarted } from "../action/uploadFile";


function* sendMessageSaga(): any {
    try {
        let message = yield select((state: any) => state.chat.message)
        let groupId = yield select((state: any) => state.chat.groupId)


        database().ref(`/chatRooms/${groupId}/messages`).push({
            id: uuidv4(),
            sender: {
                id: auth().currentUser?.uid,
                name: auth().currentUser?.displayName,
                photoURL: auth().currentUser?.photoURL,
            },
            time: Date.parse(Date()),
            content: message,
            type: {
                name: "text",
                id: 1,
            }
        });

    } catch (error) {

    }

}

function* selectAndUploadPDF(): any {
    try {
        const result = yield call(DocumentPicker.pick, {
            type: [DocumentPicker.types.pdf],
        });

        const { name, uri } = result[0];
        const storageRef = storage().ref(`pdfs/${name}`);
        const uploadTask = storageRef.putFile(uri);

        yield put(uploadingStarted());

        const chatRoomId = yield select((state: any) => state.roomDetail.roomId)

        console.log("upload task", uploadTask)

        yield call(
            [uploadTask, uploadTask.on],
            'state_changed',
            progress => {
                const percentage = (progress.bytesTransferred / progress.totalBytes);
                console.log(percentage)
                put(uploadingProgress(percentage));
            }
        );

        const downloadURL = yield call([storageRef, storageRef.getDownloadURL]);

        console.log("download URl", downloadURL)

        yield call(() => database().ref(`/chatRooms/${chatRoomId}/messages`).push({
            id: uuidv4(),
            sender: {
                id: auth().currentUser?.uid,
                name: auth().currentUser?.displayName,
                photoURL: auth().currentUser?.photoURL,
            },
            time: Date.parse(Date()),
            content: name,
            url: downloadURL,
            type: {
                name: 'file',
                id: 3,
            },
        }))

        yield put(uploadingFinished());
    } catch (error) {
        yield put(uploadingError(error));
    }
}

export function* watchSelectAndUploadPDF() {
    yield takeLatest('SELECT_AND_UPLOAD_PDF', selectAndUploadPDF);
}

export function* chatSaga(): any {
    yield all([
        takeEvery(SEND_MESSAGE, sendMessageSaga)
    ]);
}