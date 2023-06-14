import { put, call, select, all, takeEvery, takeLatest, take } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import ImageCropPicker from 'react-native-image-crop-picker';
// import { uploadImageToStorage } from '../services/storage';
// import firebase from '../services/firebase';
import { Platform } from 'react-native'
import RNFS, { stat } from 'react-native-fs';
import storage, { firebase } from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import { eventChannel } from 'redux-saga';

const storageRef = firebase.storage().ref();
const databaseRef = firebase.database().ref();

function* createUploadProgressChannel(tasks: any) {
    return eventChannel((emit) => {
        const unsubscribe = tasks.map((task: any) => {
            task.on('state_changed', (snapshot: any) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                console.log("progress")
                emit(progress);
            });
        });

        return () => {
            unsubscribe.forEach((unsub: any) => unsub());
        };
    })
}


function* uploadImages(images: any): any {
    let promises: any = [];
    let referenceList: any = [];


    for (const image of images) {
        // const storageRef = storage().ref(`images/${image.filename}`);
        const reference = storageRef.child(`images/${image.filename}`);
        const path = Platform.OS === 'ios' ? image.path : image.path.replace('file://', '');
        const fileUri = yield call(RNFS.readFile, path, 'base64');
        const uploadTask = reference.putString(fileUri, 'base64');
        promises.push(uploadTask);
        referenceList.push(reference)
    };
    console.log("promises", promises)
    return { promises, referenceList };
};

function* uploadImagesSagas(): any {
    const images = yield ImageCropPicker.openPicker({ multiple: true });
    const { promises, referenceList } = yield call(uploadImages, images);
    console.log("tasks", promises)
    const channel = yield call(createUploadProgressChannel, promises);


    const urls = [];

    while (true) {
        try {
            const progress = yield take(channel);
            console.log('Upload progress:', progress);
            yield put({
                type: "UPLOAD_PROGRESS", payload: {
                    progress: progress
                }
            })
            if (!progress) {
                console.log('Data is null');
                continue;
            }
            if (progress === 1) {
                for (const reference of referenceList) {

                    let url = yield reference.getDownloadURL()
                    console.log("task", url)
                    urls.push(url);
                    console.log("url", url)

                }
                yield put({ type: 'UPLOAD_COMPLETE', payload: urls });
                const id = yield select((state: any) => state.roomDetail.roomId)

                console.log("list", urls)

                yield databaseRef.child(`/chatRooms/${id}/messages`).push({
                    id: uuidv4(),
                    sender: {
                        id: auth().currentUser?.uid,
                        name: auth().currentUser?.displayName,
                        photoURL: auth().currentUser?.photoURL,
                    },
                    time: Date.parse(Date()),
                    content: urls,
                    type: {
                        name: 'image',
                        id: 2,
                    },
                });
                channel.close();
                break;
            }
        } catch (error) {
            yield put({ type: 'UPLOAD_ERROR', payload: error });


        }

    }

}


export function* selectImage() {
    yield takeEvery('SELECT_IMAGES', uploadImagesSagas);
}
