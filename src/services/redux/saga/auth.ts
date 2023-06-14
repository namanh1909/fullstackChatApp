import { call, put, select, takeEvery, all, takeLatest } from 'redux-saga/effects'
import { Alert } from 'react-native';
import { loginWithEmail, LoginWithGoogle, registerWithEmailFirebase } from '../../firebase/index'
import { loginSuscess, LogOut } from '../action/auth';
import { LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL } from "../actionType/index"
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import Realm from 'realm';
import { ChatRoomSchema, messageSchema, typeMessageSchema, userSchema } from '../../schema/schema';

function* loginEmail(): any {
    let email = yield select((state) => state.auth.email)
    let password = yield select((state) => state.auth.password)
    yield call(loginWithEmail, email, password)
}

function* registerWithEmail(): any {
    let email = yield select((state) => state.auth.email)
    let password = yield select((state) => state.auth.password)
    let username = yield select((state) => state.auth.username)
    yield call(registerWithEmailFirebase, email, password, username)

}


function* LoginGoogle(): any {
    yield call(LoginWithGoogle)
}

function* logOut(): any {
    yield call(() => auth().signOut())
    yield call(() => (async () => {
        try {
            const realm = await Realm.open({
                path: 'realm-files/myrealm',
                schema: [ChatRoomSchema, userSchema, messageSchema, typeMessageSchema],
            });
            realm.write(() => {
                realm.deleteAll()
            });
            realm.close();
        } catch (err: any) {
            console.error('Failed to open the realm', err.message);
        }
    })())
    console.log("logout call")
}

export function* authSaga(): any {
    yield all([
        takeLatest(LOGIN_WITH_GOOGLE, LoginGoogle),
        takeLatest(REGISTER_WITH_EMAIL, registerWithEmail),
        takeEvery(LOGOUT, logOut),
        takeLatest(LOGIN_WITH_EMAIL, loginEmail)
    ]);
}