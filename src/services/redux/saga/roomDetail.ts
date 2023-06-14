import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { eventChannel } from 'redux-saga';
import { all, call, put, select, takeLatest, take, takeEvery } from 'redux-saga/effects';
import { getRoomDetalSuscess } from '../action/roomDetail';
import { GET_ROOM_CHAT_DETAIL, } from '../actionType';
import { createChatRoomsChannel, sortByTime } from './roomChat';

export function* getListChatFromID(): any {

    const channel = yield call(createChatRoomsChannel);
    try {
        yield put({ type: "ROOM_DETAIL_LOADING" })

        while (true) {
            const data = yield take(channel);
            let idSelect = yield select((state) => state.roomDetail.roomId)
            console.log("id select", idSelect)
            const dataArray: any = Object?.entries(data).map(([id, data]) => ({
                id,
                data,
            }));
            let roomDetail: any = []

            dataArray.forEach((element: any) => {
                if (element.id == idSelect) {
                    console.log("has")
                    roomDetail = element
                }
            });

            const roomDetailConvert: any = Object?.entries(roomDetail.data?.messages).map(([id, data]) => ({
                id,
                data,
            }));

            console.log("dataChatDetail", roomDetailConvert)
            yield put(getRoomDetalSuscess(sortByTime(roomDetailConvert)))

        }
    } catch (error) {
        console.log('Error in watchChatRoomsUpdates:', error);
    } finally {
        channel.close();
    }


}


export function* roomDetail(): any {
    yield all([
        takeLatest(GET_ROOM_CHAT_DETAIL, getListChatFromID),
    ]);
}
