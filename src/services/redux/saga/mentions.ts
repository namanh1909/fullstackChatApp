
import database from '@react-native-firebase/database'
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { getMentions, getMentionsSuscess, mentionsUpdated } from '../action/mentions';
import { DELETE_MENTION, GET_MENTIONS, GET_USER, SEND_MENTIONS } from '../actionType';
import auth from '@react-native-firebase/auth'
import { eventChannel } from 'redux-saga';
import { stat } from 'react-native-fs';
import { replaceMentionValues } from 'react-native-controlled-mentions';



function* dispatchNullMentions() {
    yield put({ type: "MENTIONS_NULL_VALUE" })
    console.log("dispatch")
}

function createMentionsRef() {
    return database().ref(`/mentions/${auth().currentUser?.uid}`);
}

function createMentionsChannel() {
    const mentionsRef = createMentionsRef();
    return eventChannel((emit) => {
        mentionsRef.on('value', (snapshot) => {
            try {
                emit(snapshot.val());
                dispatchNullMentions()
            } catch (error) {
                console.log("error")
            }
        });
        return () => mentionsRef.off();
    });
}

function* sendMentions(): any {
    const mentionsList: any = yield select((state: any) => state.mentions.listUserMention)
    const id = yield select((state: any) => state.roomDetail.roomId)
    const messages = yield select((state: any) => state.mentions.messages)
    const name = yield select((state: any) => state.mentions.name)
    const item = yield select((state: any) => state.mentions.item)
    const listMember = yield select((state: any) => state.mentions.listMembers)

    if (mentionsList.length > 0) {
        mentionsList.forEach((element: any) => {
            database()
                .ref(`/mentions/${element.id}`)
                .push({
                    roomChatID: id,
                    mentions: mentionsList,
                    mentioned: {
                        id: auth().currentUser?.uid,
                        name: auth().currentUser?.displayName,
                        photoURL: auth().currentUser?.photoURL,
                    },
                    messages: replaceMentionValues(
                        messages,
                        ({ name }) => `@${name}`,
                    ),
                    nameGroup: name,
                    members: item,
                    list: listMember,
                });
        });
    }
}

export function* watchMentionsUpdates(): any {
    const channel = yield call(createMentionsChannel);
    yield put({ type: "MENTIONS_LOADING" })
    try {
        while (true) {
            const data = yield take(channel);

            if (!data) {
                console.log('Data is null');
                continue;
            }
            const dataArray: any = Object?.entries(data).map(([id, data]) => ({
                id,
                data,
            }));

            yield put(mentionsUpdated(dataArray));
        }
    } catch (error) {
        console.log('Error in watchMentionsUpdates:', error);
    } finally {
        channel.close();
    }
}

export function* mentionsSaga(): any {
    yield all([
        takeLatest(GET_MENTIONS, watchMentionsUpdates),
        takeEvery(SEND_MENTIONS, sendMentions)
    ]);
}