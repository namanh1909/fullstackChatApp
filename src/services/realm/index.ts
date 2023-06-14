import { ChatRoomSchema, messageSchema, typeMessageSchema, userSchema } from "../schema/schema";

import Realm from "realm";

import NetInfo from "@react-native-community/netinfo";

export async function addRealmRoom(listRoom: any) {
    try {
        const realm = await Realm.open({
            path: 'realm-files/myrealm',
            schema: [
                ChatRoomSchema,
                userSchema,
                messageSchema,
                typeMessageSchema,
            ],
        });
        let ChatRoom: any = JSON.parse(
            JSON.stringify(realm.objects('ChatRoom')),
        );

        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);

            if (state.isConnected) {
                realm.write(() => {
                    realm.deleteAll()
                });

                listRoom.forEach((element: any) => {
                    const message: any = element.data?.messages;
                    function convertObjectToArray(obj: any) {
                        const result = [];

                        for (const key in obj) {
                            result.push({
                                id: key,
                                data: obj[key],
                            });
                        }

                        return result;
                    }
                    let dataArray = convertObjectToArray(message);


                    // console.log('filter', dataArray);

                    const formattedData = dataArray.map((item: any) => {
                        return {
                            content: JSON.stringify(item.data.content),
                            id: item.data.id,
                            sender: item.data.sender,
                            time: item.data.time,
                            type: item.data.type,
                        };
                    });


                    realm.write(() => {
                        realm.create('ChatRoom', {
                            id: `${element.id}`,
                            name: element.data.name,
                            members: element.data.members,
                            messages: formattedData,
                        });
                    });

                    // console.log('chatROom', ChatRoom);
                });
            }
        });
        // console.log('Chat room realm', ChatRoom);

        let newChatRoom: any = JSON.parse(
            JSON.stringify(realm.objects('ChatRoom')),
        );
        console.log('new Realm', newChatRoom);
    } catch (error) {
        console.log('Realm error', error);
    }
}


export function getRoomRealm() {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const realm = await Realm.open({
                    path: 'realm-files/myrealm',
                    schema: [
                        ChatRoomSchema,
                        userSchema,
                        messageSchema,
                        typeMessageSchema,
                    ],
                });

                let newChatRoom: any = JSON.parse(
                    JSON.stringify(realm.objects('ChatRoom')),
                );
                resolve(newChatRoom);
            } catch (err: any) {
                console.error('Failed to open the realm', err.message);
                reject(err);
            }
        })();
    });
}

