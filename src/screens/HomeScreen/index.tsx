import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useRef, useState, useEffect, useMemo, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import NavBar from '../../components/NavBar';
import SearchInput from '../../components/SearchInput';
import {useDispatch, useSelector} from 'react-redux';
import {getIdSelect, loginSuscess} from '../../services/redux/action/auth';
import {
  deleteRoom,
  getListRoom,
  getSelectRoom,
  leaveGroup,
} from '../../services/redux/action/roomChat';
import {ChatRoom} from '../../services/entities';
import GroupAvatar from '../../components/GroupAvatar';
import {useNetInfo} from '@react-native-community/netinfo';
import {getUserList} from '../../services/redux/action/user';
import {addRealmRoom, getRoomRealm} from '../../services/realm';
import {getRoomById} from '../../services/redux/action/roomDetail';

const HomeScreens = ({navigation}: any) => {
  const dispatch = useDispatch();
  let user = auth().currentUser;
  let bottomRef = useRef(new Animated.Value(400)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectItem, setSelectItem] = useState<ChatRoom | any>();
  const [realmRoomChat, setRealmRoomChat] = useState<any>([]);
  const netinfo = useNetInfo();
  const [refetch, setRefetch] = useState(false);

  function selectRoom(item: any) {
    Animated.timing(bottomRef, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
      delay: 200,
    }).start();
    setModalVisible(true);
    setSelectItem(item);
    dispatch(getSelectRoom(item));
  }

  useEffect(() => {
    dispatch(getListRoom());
    dispatch(loginSuscess());
    return () => {
      dispatch(getListRoom());
    };
  }, []);
  let listRoom: any[] = useSelector((state: any) => state.roomChat.roomList);
  let isLoading: any[] = useSelector((state: any) => state.roomChat.isLoading);

  console.log('listRoom', listRoom);

  useMemo(() => {
    getRoomRealm()
      .then(newChatRoom => {
        setRealmRoomChat(newChatRoom);
      })
      .catch(error => {
        console.error('Failed to get chat rooms', error.message);
      });
  }, []);

  console.log('realm list', realmRoomChat);

  const [searchQuery, setSearchQuery] = useState<any>('');
  const handleSearchQueryChange = (query: any) => {
    setSearchQuery(query);
  };

  const roomChatValue: any = listRoom.filter((item: any) =>
    item.data?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function getTheLastMessage(obj: any) {
    if (obj) {
      const orderedObj = Object.fromEntries(
        Object.entries(obj).sort(([, a]: any, [, b]: any) => a.time - b.time),
      );
      const keys = Object.keys(orderedObj);
      const lastKey = keys[keys.length - 1];
      const lastObject = obj[lastKey];

      if (lastObject.type.id == 3) {
        return 'Tệp';
      }
      if (lastObject.type.id == 2) {
        return 'Hình ảnh';
      } else {
        return lastObject.content;
      }
    }
  }

  useEffect(() => {
    addRealmRoom(listRoom);
  }, []);

  const renderLeftActions = (item: any) => {
    return (
      <Animated.View style={styles.containerActionRight}>
        <RectButton
          onPress={() => {
            selectRoom(item);
          }}>
          <IonIcons name="ellipsis-horizontal-outline" size={22} />
        </RectButton>
        <RectButton
          onPress={() => {
            dispatch(getIdSelect(item.id));
            dispatch(deleteRoom());
            setRefetch(!refetch);
          }}>
          <IonIcons name="trash-outline" size={22} color="#FF3742" />
        </RectButton>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    return <View style={{height: 0.3, backgroundColor: 'gray'}} />;
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: !modalVisible ? '#f5f5f5' : 'transparent',
        flex: 1,
      }}>
      <NavBar
        leftButton={
          user?.photoURL ? (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={{uri: `${user?.photoURL}`}}
                style={styles.avatar}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <IonIcons name="person-outline" size={30} />
            </TouchableOpacity>
          )
        }
        title="Stream Chat"
        rightButton={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateRoom');
            }}>
            <IonIcons name="eyedrop-outline" size={18} color="#005FFF" />
          </TouchableOpacity>
        }
      />
      <SearchInput
        value={searchQuery}
        onChangeText={(value: any) => {
          handleSearchQueryChange(value);
        }}
      />
      {isLoading && <ActivityIndicator size="large" />}
      {listRoom?.length === 0 && netinfo.isConnected ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 150,
          }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(getListRoom());
            }}>
            <IonIcons name="reload-outline" size={60} />
          </TouchableOpacity>
          <View>
            <IonIcons name="chatbubbles-outline" size={150} />
            <Text>Let’s start chatting!</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateRoom');
            }}
            style={{
              marginTop: 100,
            }}>
            <Text
              style={{
                color: '#005FFF',
              }}>
              Start a chat
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={netinfo.isConnected ? roomChatValue : realmRoomChat}
          keyExtractor={item => item.id}
          ListFooterComponent={roomChatValue.length > 0 ? renderFooter : null}
          ItemSeparatorComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                dispatch(getListRoom());
              }}
            />
          }
          renderItem={({item, index}: any) => {
            return (
              <View>
                <Swipeable
                  renderRightActions={() => renderLeftActions(item)}
                  key={index || item.id}>
                  <TouchableOpacity
                    onPress={() => {
                      if (netinfo.isConnected) {
                        dispatch(getRoomById(item.id));
                        navigation.navigate('RoomChat', {
                          group: item.data?.members?.map(
                            (member: any) => member?.photoURL,
                          ),
                          id: item.id,
                          name: item.data?.name,
                          item: item,
                          list: item.data?.members,
                        });
                        dispatch(getListRoom());
                      } else {
                        navigation.navigate('RoomChat', {
                          group: item.members?.map(
                            (member: any) => member?.photoURL,
                          ),
                          id: item.id,
                          name: item.name,
                          item: item,
                        });
                      }
                    }}
                    style={styles.itemContainer}>
                    <GroupAvatar
                      item={
                        netinfo.isConnected &&
                        item.data?.members?.map(
                          (member: any) => member?.photoURL,
                        )
                      }
                    />
                    <View>
                      <Text style={styles.title}>
                        {netinfo.isConnected ? item.data?.name : item.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          maxWidth: 300,
                          color: '#7A7A7A',
                        }}>
                        {netinfo.isConnected
                          ? getTheLastMessage(item.data?.messages)
                          : item?.messages[item?.messages?.length - 1]?.content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              </View>
            );
          }}
        />
      )}

      <Modal
        key={selectItem?.id}
        transparent={true}
        visible={modalVisible}
        style={{backgroundColor: 'red'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPressOut={() => {
            setModalVisible(!modalVisible);
            Animated.timing(bottomRef, {
              toValue: 400,
              duration: 1000,
              useNativeDriver: false,
            }).start();
            // console.log('press out');
          }}></TouchableOpacity>
        <Animated.View
          style={{
            // flex: 1,
            height: '40%',
            backgroundColor: '#fff',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            transform: [
              {
                translateY: bottomRef,
              },
            ],
          }}>
          <Text style={styles.titleSheet}>{selectItem?.data.name}</Text>
          <Text style={styles.members}>
            {selectItem?.data.members.length} member
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={{
              marginLeft: 20,
            }}>
            {selectItem?.data.members.map((item: ChatRoom | any) => {
              return (
                <View key={item.id} style={styles.containerSheet}>
                  <Image
                    source={{uri: item?.photoURL}}
                    style={styles.avatarItem}
                  />
                  <Text
                    style={{
                      maxWidth: 60,
                    }}>
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
          <View
            style={{
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <View
              style={{
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(leaveGroup());
                }}
                style={styles.leaveButton}>
                <IonIcons
                  name="log-out-outline"
                  size={20}
                  style={{
                    marginRight: 10,
                  }}
                />
                <Text>Leave Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(getIdSelect(selectItem.id));
                  dispatch(deleteRoom());
                  setModalVisible(false);
                }}
                style={styles.deleteButton}>
                <IonIcons
                  name="trash-outline"
                  size={20}
                  color="#FF3742"
                  style={{
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    color: '#FF3742',
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({
  containerActionRight: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  avatarItem: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  containerSheet: {
    marginRight: 20,
    alignItems: 'center',
    marginTop: 60,
  },
  titleSheet: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  members: {
    color: '#7A7A7A',
    fontSize: 12,
    textAlign: 'center',
  },
  leaveButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f5f5f5',
  },
  deleteButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#f5f5f5',
  },
});
