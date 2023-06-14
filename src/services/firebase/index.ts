import auth from '@react-native-firebase/auth'
import { Alert } from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { webClientId } from '../../constants';
import database from '@react-native-firebase/database';
import Realm from 'realm';
import { ChatRoomSchema, messageSchema, typeMessageSchema, userSchema, mentionsSchema } from '../schema/schema';
import { watchChatRoomsUpdates } from '../redux/saga/roomChat';


const strongRegex = new RegExp(
    '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
);

export const registerWithEmailFirebase = async (
    email: string,
    password: string,
    username: string,
) => {

    if (!strongRegex.test(email)) {
        return Alert.alert('That email address is invalid!');
    }
    else if (username.length < 3) {
        return Alert.alert('That username is invalid!');
    }
    else if (password.length < 6) {
        return Alert.alert('That password is invalid!');
    }

    else {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async () => {
                auth().currentUser?.updateProfile({
                    displayName: username,
                });
                console.log(
                    'User account created & signed in!, name:',
                    auth().currentUser?.displayName,
                );

            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    return Alert.alert('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('That email address is invalid!');
                }

                console.error(error);
            });
    }

};

export const loginWithEmail = (email: string, password: any) => {
    try {
        auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
        return Alert.alert('error', error);
    }
};

export const LoginWithGoogle = async () => {
    await GoogleSignin.configure({
        webClientId: webClientId,
    });

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // auth().signInWithCredential(googleCredential);

    return auth().signInWithCredential(googleCredential).then(async () => {
        const { UUID } = Realm.BSON;
        database()
            .ref(`/users`)
            .on('value', async snapshot => {
                let data = snapshot.val()
                let i = 0
                const dataArray = Object.entries(data).map(([id, data]) => ({ id, data }));
                // console.log("data array", dataArray)
                dataArray.forEach((element: any) => {
                    if (element.data.id === auth().currentUser?.uid) {
                        i++
                    }
                });
                if (i == 0) {
                    database()
                        .ref(`/users`)
                        .push({
                            id: auth().currentUser?.uid,
                            name: auth().currentUser?.displayName,
                            photoURL: auth().currentUser?.photoURL
                        })
                }
            });
    });
}

