import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItemInfo,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../../components/NavBar';
import IonIcons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import SearchInput from '../../../components/SearchInput';
import {userType} from '../../../services/entities';
import {useDispatch, useSelector} from 'react-redux';
import {getUserList} from '../../../services/redux/action/user';
import auth from '@react-native-firebase/auth';
import {
  createRoom,
  saveRoomChat,
} from '../../../services/redux/action/roomChat';

const CreateGroupScreen = ({navigation, route}: any) => {
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [listSelect, setListSelect] = useState<Array<userType> | any>([
    {
      id: auth().currentUser?.uid,
      name: auth().currentUser?.displayName,
      photoURL: auth().currentUser?.photoURL,
    },
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserList());
  }, []);

  async function addUserToList(item: userType) {
    if (listSelect.includes(item)) {
      let newList = listSelect.filter((items: userType) => items !== item);
      setListSelect(newList);
    } else {
      setListSelect(listSelect.concat(item));
    }
  }

  let userList = useSelector((state: any) => state.user.userList);
  let isLoading = useSelector((state: any) => state.user.isLoading);

  const [searchQuery, setSearchQuery] = useState<any>('');
  const handleSearchQueryChange = (query: any) => {
    setSearchQuery(query);
  };
  const userListValue = userList.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <SafeAreaView style={styles.container}>
      <NavBar
        leftButton={
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Tab'}],
              }); // navigation.goBack();
            }}>
            <IonIcons name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        rightButton={
          listSelect.length > 1 && (
            <TouchableOpacity
              onPress={() => {
                if (listSelect.length > 2) {
                  navigation.navigate('SetNameRoom', {
                    listSelect,
                  });
                  setListSelect([
                    {
                      id: auth().currentUser?.uid,
                      name: auth().currentUser?.displayName,
                      photoURL: auth().currentUser?.photoURL,
                    },
                  ]);
                } else {
                  dispatch(saveRoomChat(listSelect, listSelect[1].name));
                  dispatch(createRoom());
                  // setName('');
                  // navigation.navigate('RoomChat', {id: newId});
                  setListSelect([
                    {
                      id: auth().currentUser?.uid,
                      name: auth().currentUser?.displayName,
                      photoURL: auth().currentUser?.photoURL,
                    },
                  ]);
                  navigation.goBack();
                }
              }}>
              <IonIcons name="arrow-forward-outline" size={20} />
            </TouchableOpacity>
          )
        }
        title="Add Group Members"
      />
      <SearchInput value={searchQuery} onChangeText={handleSearchQueryChange} />
      {isLoading && <ActivityIndicator size="large" />}

      {listSelect.length > 1 && (
        <View
          style={{
            height: 100,
          }}>
          <ScrollView horizontal>
            {listSelect.map((item: any) => {
              if (item.id !== auth().currentUser?.uid) {
                return (
                  <View
                    key={item.id}
                    style={{
                      marginHorizontal: 10,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: item?.photoURL}}
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        maxWidth: 50,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      height: 0,
                    }}></View>
                );
              }
            })}
          </ScrollView>
        </View>
      )}

      {userList && userList.length > 0 ? (
        <FlatList
          data={userListValue}
          keyExtractor={(item: userType) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                dispatch(getUserList());
              }}
            />
          }
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 3,
                  width: '100%',
                  backgroundColor: '#f5f5f5',
                }}
              />
            );
          }}
          renderItem={({item, index}: any) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => addUserToList(item)}
                style={styles.buttonUser}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{uri: item?.photoURL}} style={styles.avatar} />

                  <View>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 14,
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: '#7A7A7A',
                        fontSize: 12,
                      }}>
                      Stream test account
                    </Text>
                  </View>
                </View>

                {listSelect.includes(item) && (
                  <IonIcons name="checkmark-circle-outline" size={20} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text>
          Không tìm thấy user{' '}
          <TouchableOpacity
            onPress={() => {
              dispatch(getUserList());
            }}>
            <Text>Tải lại</Text>
          </TouchableOpacity>
        </Text>
      )}
    </SafeAreaView>
  );
};

export default CreateGroupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonUser: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    justifyContent: 'space-between',
  },
});
