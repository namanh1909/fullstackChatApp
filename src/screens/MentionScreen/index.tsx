import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import IonIcons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../components/NavBar';
import SearchInput from '../../components/SearchInput';
import {useDispatch, useSelector} from 'react-redux';
import {getMentions} from '../../services/redux/action/mentions';
import {getListRoom} from '../../services/redux/action/roomChat';
import GroupAvatar from '../../components/GroupAvatar';

const MentionScreen = ({navigation}: any) => {
  let user = auth().currentUser;
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMentions());
    dispatch(getListRoom());
  }, []);
  let mentionsList = useSelector((state: any) => state.mentions.mentionsList);
  console.log('mentiosn list', mentionsList);
  let isLoading = useSelector((state: any) => state.mentions.isLoading);
  console.log('mentiosn list', mentionsList);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <NavBar
        leftButton={
          user?.photoURL ? (
            <Image source={{uri: `${user?.photoURL}`}} style={styles.avatar} />
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
      {isLoading && <ActivityIndicator size="large" />}
      {mentionsList.length == 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 100,
          }}>
          <Text
            style={{
              textAlign: 'center',
            }}>
            Không có dữ liệu
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                color: 'blue',
              }}>
              Tải lại
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={mentionsList}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              dispatch(getMentions());
            }}
          />
        }
        ItemSeparatorComponent={() => (
          <View style={{height: 0.3, backgroundColor: 'gray'}} />
        )}
        renderItem={({item}: any) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigation.navigate('RoomChat', {
                  id: item.data.roomChatID,
                  group: item.data.members,
                  name: item.data.nameGroup,
                  list: item.data.list,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 10,
              }}>
              <GroupAvatar item={item.data.members} />
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {item.data.nameGroup}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                  }}>
                  {item.data.messages}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default MentionScreen;

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});
