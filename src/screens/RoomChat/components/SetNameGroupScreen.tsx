import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import NavBar from '../../../components/NavBar';
import IonIcons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import {useDispatch, useSelector} from 'react-redux';
import {
  createRoom,
  getListRoom,
  saveRoomChat,
} from '../../../services/redux/action/roomChat';

const SetNameGroupScreen = ({navigation, route}: any) => {
  const [listSelect, setListSelect] = useState(route.params.listSelect);
  const dispatch = useDispatch();
  // console.log('list params', listSelect);
  useEffect(() => {
    if (listSelect.length === 0)
      navigation.reset({
        index: 0,
        routes: [{name: 'CreateRoom'}],
      });
  });

  const [name, setName] = useState('');
  let newId = useSelector((state: any) => state.roomChat.nameNewCreate);

  function removeItem(item: any) {
    let newList = listSelect.filter((items: any) => items !== item);
    setListSelect(newList);
    // console.log('list', listSelect);
  }

  function createRoomChatNew() {
    dispatch(saveRoomChat(listSelect, name));
    dispatch(createRoom());
    setName('');
    setListSelect([]);
    navigation.reset({
      index: 0,
      routes: [{name: 'Tab'}],
    }); // navigation.goBack();
  }

  return (
    <SafeAreaView>
      <NavBar
        leftButton={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateRoom');
            }}>
            <IonIcons name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        title="Name of Group Chat"
        rightButton={
          name.length > 3 && (
            <TouchableOpacity
              onPress={() => {
                createRoomChatNew();
              }}>
              <IonIcons name="checkmark-circle-outline" size={30} />
            </TouchableOpacity>
          )
        }
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            marginHorizontal: 10,
          }}>
          NAME
        </Text>
        <TextInput
          style={{
            width: '80%',
            height: 60,
          }}
          value={name}
          onChangeText={value => setName(value)}
        />
      </View>
      <Text
        style={{
          marginLeft: 10,
        }}>
        {listSelect.length} member
      </Text>
      <FlatList
        data={listSelect}
        renderItem={({item}: any) => {
          return (
            <View style={styles.containerSelect}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={{uri: item.photoURL}} style={styles.avatar} />
                <Text>{item.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  removeItem(item);
                }}>
                <IonIcons name="restaurant-outline" size={20} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SetNameGroupScreen;

const styles = StyleSheet.create({
  containerSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
