
import database from '@react-native-firebase/database'
import { all, call, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { getUserListSucess } from '../action/user';
import { GET_USER } from '../actionType';
import auth from '@react-native-firebase/auth'

function getUserList(): Promise<any[]> {
    return database()
        .ref(`/users/`)
        .once('value')
        .then(snapshot => {
            let data = snapshot.val();
            const dataArray = Object.entries(data).map(([id, data]) => ({
                data,
            }));
            // console.log("array user", dataArray)
            const result: any = dataArray.map(({ data: { id, name, photoURL } }: any) => ({ id, name, photoURL }));
            return result.filter((obj: any) => obj.id !== auth().currentUser?.uid);
        });
}

function* getUserListSaga(): any {
    try {
        yield put({ type: "USER_LIST_LOADING" })
        let a = yield call(getUserList)
        // console.log("GET LIST")
        yield put(getUserListSucess(a))
    } catch (error) {

    }

}

export function* userSaga(): any {
    yield all([
        takeEvery(GET_USER, getUserListSaga)
    ]);
}