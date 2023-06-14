
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { all, call, put, select, takeLatest, take, takeEvery } from 'redux-saga/effects';
import { chatRoomsUpdated, createSuscess, getListRoom } from '../action/roomChat';
import { CREATE_ROOM, DELETE_ROOM, GET_LIST_ROOM, LEAVE_ROOM } from '../actionType';
import { eventChannel } from 'redux-saga';
import { addRealmRoom } from '../../realm';

function createChatRoomsRef() {
    return database().ref('/chatRooms/');
}

function* dispatchNullChatRoom() {
    yield put({ type: "CHAT_ROOM_NULL_DATA" })
    console.log("dispatch")
}

export function createChatRoomsChannel() {
    const chatRoomsRef = createChatRoomsRef();
    return eventChannel((emit) => {
        chatRoomsRef.on('value', (snapshot) => {
            try {
                emit(snapshot.val());

            } catch (error) {
                console.log("error")
                dispatchNullChatRoom()
            }
        });

        return () => chatRoomsRef.off();
    });
}

export function* watchChatRoomsUpdates(): any {
    const channel = yield call(createChatRoomsChannel);
    try {
        yield put({ type: "CHAT_ROOM_LOADING" })
        while (true) {
            const data = yield take(channel);
            if (!data) {
                console.log('Data is null');
                continue;
            }
            let dataChat: any = [];
            let dataArray: any = Object?.entries(data).map(([id, data]) => ({
                id,
                data,
            }));
            dataArray?.forEach((element: any) => {
                element?.data?.members.forEach((elements: any) => {
                    if (elements?.id == auth().currentUser?.uid) {
                        dataChat.push(element);
                    }
                });
            });
            yield call(addRealmRoom, dataChat)
            console.log("dataChat", dataChat)
            yield put(chatRoomsUpdated(dataChat));

        }
    } catch (error) {
        console.log('Error in watchChatRoomsUpdates:', error);
    } finally {
        channel.close();
    }
}

function getMentionsList(): Promise<any[]> {
    return database()
        .ref(`/mentions/`)
        .once('value')
        .then(snapshot => {
            let data = snapshot.val();
            const dataArray = Object.entries(data).map(([id, data]) => ({
                id,
                data,
            }));
            console.log("array user", dataArray)
            return dataArray;
        });
}


function* createRoomChatSaga(): any {
    try {
        let listSelect = yield select((state) => state.roomChat.listSelect)
        let nameRoom = yield select((state) => state.roomChat.nameNewCreate)
        let newReference = database().ref(`/chatRooms`).push({
            name: nameRoom,
            messages: null,
            members: listSelect,
        });
        console.log('key', newReference.key);
        yield put(createSuscess(newReference.key))
        yield put(getListRoom())
    } catch (error) {
    }
}


function* deleteRoomChatSaga(): any {
    try {
        let list = yield call(getMentionsList)
        let id = yield select((state) => state.roomChat.selectId)
        let roomChat = yield select((state) => state.roomChat.roomList)
        console.log("list select", list)
        list.forEach((element: any) => {
            if (element.data?.roomChatID == id) {
                console.log(element.data?.roomChatID)
                database().ref(`/mentions/${element.id}`).remove();
            }
        });
        database().ref(`/chatRooms/${id}`).remove();
        yield call(watchChatRoomsUpdates)
    } catch (error) {
    }

}

async function deleteUserFromRoom(listSelect: any) {
    console.log("select", listSelect)
    listSelect.data.members.forEach((elements: any, index: number) => {
        if (elements.id === auth().currentUser?.uid) {
            database().ref(`/chatRooms/${listSelect.id}/members/${index}`).remove();
            console.log("leave")
            return
        }
    })

}

function* leaveGroup(): any {
    let listSelect: any = yield select((state) => state.roomChat.roomSelect)
    console.log("select", listSelect)

    yield call(deleteUserFromRoom, listSelect)
    // yield put(getListRoom())

}


export function sortByTime(arr: any) {
    arr.sort((a: any, b: any) => {
        return b.data.time - a.data.time;
    });
    return arr;
}




export function* roomSaga(): any {
    yield all([
        takeEvery(GET_LIST_ROOM, watchChatRoomsUpdates),
        takeLatest(CREATE_ROOM, createRoomChatSaga),
        takeLatest(DELETE_ROOM, deleteRoomChatSaga),
        takeLatest(LEAVE_ROOM, leaveGroup)
    ]);
}