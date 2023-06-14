import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Alert,
  ProgressViewIOS,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import NavBar from '../../components/NavBar';
import IonIcons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {getMessage, sendMessage} from '../../services/redux/action/chat';
import {
  MentionInput,
  MentionSuggestionsProps,
  Suggestion,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import GroupAvatar from '../../components/GroupAvatar';
import RenderImage from '../../components/RenderImage';
import {useNetInfo} from '@react-native-community/netinfo';
import MessageListItem from '../../components/MessageListItem';
import {
  getDetailRoomChat,
  getRoomById,
} from '../../services/redux/action/roomDetail';
import {
  getListMentionUser,
  sendMentions,
} from '../../services/redux/action/mentions';
import {getListRoom} from '../../services/redux/action/roomChat';

const RoomChatScreen = ({navigation, route}: any) => {
  const [messages, setMessage] = useState<any>('');
  const id = route?.params.id;
  const name = route?.params.name;
  let mentions = useRef<any>([]).current;
  const item = route?.params.group;
  const listMember = route?.params.list;
  const [isFetching, setIsFetching] = useState(false);

  const listChatParams = route?.params?.item;

  // console.log('item mention', item);

  const dispatch = useDispatch();

  const netinfo = useNetInfo();

  const uploadProgress = useSelector(
    (state: any) => state.uploadImage.progress,
  );
  console.log('uploadProgress', uploadProgress);
  useEffect(() => {
    dispatch(getDetailRoomChat());
    dispatch(getRoomById(id));
  }, []);

  let chatValue = useSelector((state: any) => state.roomDetail.listChat);
  let process = useSelector(
    (state: any) => state.uploadFile.progressPercentage,
  );

  let isLoading = useSelector((state: any) => state.roomDetail.isLoading);
  // console.log('Chat value detail', chatValue);
  // console.log('process', process);

  const dispath = useDispatch();

  const renderSuggestions: (
    suggestions: Suggestion[],
  ) => FC<MentionSuggestionsProps> =
    suggestions =>
    ({keyword, onSuggestionPress}) => {
      if (keyword == null) {
        return null;
      }
      return (
        <View style={styles.suggestion}>
          {suggestions
            .filter(
              (one: any) =>
                one.name
                  .toLocaleLowerCase()
                  .includes(keyword.toLocaleLowerCase()) &&
                !mentions.includes(one),
            )
            .map((one: any) => (
              <Pressable
                key={one.id}
                onPress={() => {
                  onSuggestionPress(one);
                  mentions.push(one);

                  // console.log('mentions', mentions);
                }}
                style={{padding: 10}}>
                <Text>{one.name}</Text>
              </Pressable>
            ))}
        </View>
      );
    };

  const renderMentionSuggestions = renderSuggestions(listMember);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar
        title={name}
        leftButton={
          <TouchableOpacity
            onPress={() => {
              if (netinfo) {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Tab'}],
                });
              } else {
                navigation.goBack();
              }
            }}>
            <IonIcons name="chevron-back-outline" size={30} />
          </TouchableOpacity>
        }
        rightButton={<GroupAvatar item={item} />}
        textStyle={{
          fontSize: 18,
        }}
      />
      <ProgressViewIOS
        progress={process}
        style={{backgroundColor: '#FFFFFF'}}
        trackTintColor="#FFFFFF"
        progressTintColor="#007AFF"
      />
      <ProgressViewIOS
        progress={uploadProgress}
        style={{backgroundColor: '#FFFFFF'}}
        trackTintColor="#FFFFFF"
        progressTintColor="#007AFF"
      />
      {isLoading && <ActivityIndicator size="large" />}

      <FlatList
        data={netinfo.isConnected ? chatValue : listChatParams?.messages}
        keyExtractor={item => item.id}
        inverted={true}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              dispatch(getDetailRoomChat());
              dispatch(getRoomById(id));
            }}
          />
        }
        renderItem={({item}: any) => {
          if (netinfo.isConnected) {
            return (
              <View>
                {item.data?.sender.id == auth().currentUser?.uid && (
                  <View style={styles.containerMessage}>
                    {item.data?.type.id == 2 ? (
                      <RenderImage item={item.data?.content} />
                    ) : item.data?.type.id == 3 ? (
                      <View style={styles.containerFileType}>
                        <Image
                          style={{
                            height: 40,
                            width: 40,
                          }}
                          source={require('../../../assets/Filetype.png')}
                        />
                        <Text
                          style={{
                            marginHorizontal: 10,
                            fontWeight: 'bold',
                          }}>
                          {item.data?.content}
                        </Text>
                        <TouchableOpacity>
                          <IonIcons name="cloud-download-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.containerTextType}>
                        <MessageListItem message={item.data?.content} />
                      </View>
                    )}
                  </View>
                )}
                {item.data?.sender.id !== auth().currentUser?.uid && (
                  <View style={styles.containerUser}>
                    <Image
                      source={{
                        uri: item.data?.sender.photoURL,
                      }}
                      style={styles.avatarChat}
                    />
                    {item.data?.type.id == 2 ? (
                      <RenderImage item={item.data?.content} />
                    ) : item.data?.type.id == 3 ? (
                      <View style={styles.containerFileType}>
                        <Image
                          style={{
                            height: 40,
                            width: 40,
                          }}
                          source={require('../../../assets/Filetype.png')}
                        />
                        <Text
                          style={{
                            marginHorizontal: 10,
                            fontWeight: 'bold',
                          }}>
                          {item.data?.content}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(item.data?.url);
                          }}>
                          <IonIcons name="cloud-download-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.containerMesstext}>
                        <View style={styles.viewMesstext}>
                          <MessageListItem message={item.data?.content} />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          } else {
            return (
              <View>
                {item.sender.id == auth().currentUser?.uid && (
                  <View style={styles.realmContainer}>
                    {item.type.id == 2 ? (
                      <RenderImage item={JSON.parse(item.content)} />
                    ) : item.type.id == 3 ? (
                      <View style={styles.containerFileType}>
                        <Image
                          style={{
                            height: 40,
                            width: 40,
                          }}
                          source={require('../../../assets/Filetype.png')}
                        />
                        <Text
                          style={{
                            marginHorizontal: 10,
                            fontWeight: 'bold',
                          }}>
                          {item.content.substring(1, item.content.length - 1)}
                        </Text>
                        <TouchableOpacity>
                          <IonIcons name="cloud-download-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.containerLink}>
                        <Text>
                          {item.content.substring(1, item.content.length - 1)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                {item.sender.id !== auth().currentUser?.uid && (
                  <View style={styles.containerUser}>
                    <Image
                      source={{
                        uri: item.sender.photoURL,
                      }}
                      style={styles.avatarChat}
                    />
                    {item.type.id == 2 ? (
                      <RenderImage item={JSON.parse(item.content)} />
                    ) : item.type.id == 3 ? (
                      <View style={styles.containerFileType}>
                        <Image
                          style={{
                            height: 40,
                            width: 40,
                          }}
                          source={require('../../../assets/Filetype.png')}
                        />
                        <Text
                          style={{
                            marginHorizontal: 10,
                            fontWeight: 'bold',
                          }}>
                          {item.content.substring(1, item.content.length - 1)}
                        </Text>
                        <TouchableOpacity>
                          <IonIcons name="cloud-download-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.containerLink}>
                        <Text>
                          {item.content.substring(1, item.content.length - 1)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          }
        }}
      />
      <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding">
        <View style={styles.containerInput}>
          <TouchableOpacity
            onPress={() => {
              dispatch({type: 'SELECT_AND_UPLOAD_PDF'});
            }}>
            <IonIcons name="link-outline" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // selectImages();
              dispatch({type: 'SELECT_IMAGES'});
            }}>
            <IonIcons name="hand-left-outline" size={20} />
          </TouchableOpacity>
          <MentionInput
            autoFocus
            value={messages}
            onChange={(value: any) =>
              setMessage(replaceMentionValues(value, ({name}) => `@${name}`))
            }
            partTypes={[
              {
                trigger: '@',
                renderSuggestions: renderMentionSuggestions,
                textStyle: {fontWeight: 'bold', color: '#000'}, // The mention style in the input
              },
            ]}
            placeholder="Send a message"
            textAlignVertical="center"
            style={styles.mentionInput}
          />
          <TouchableOpacity
            onPress={() => {
              // console.log('item', item);
              dispath(sendMessage(messages, id));
              // console.log('mentions', mentions);
              if (mentions.length > 0) {
                dispatch(
                  sendMentions(mentions, name, listMember, messages, item),
                );
              }

              setMessage('');
              mentions = [];
            }}>
            <IonIcons name="send-outline" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RoomChatScreen;

const styles = StyleSheet.create({
  suggestion: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  containerMessage: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 5,
    maxWidth: '70%',
  },
  containerFileType: {
    backgroundColor: '#ECEBEB',
    borderRadius: 16,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  containerTextType: {
    backgroundColor: '#ECEBEB',
    borderRadius: 16,
    borderBottomRightRadius: 0,
    padding: 10,
  },
  containerUser: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
    maxWidth: '70%',
  },
  avatarChat: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginTop: 20,
    marginRight: 10,
  },
  containerMesstext: {
    backgroundColor: '#ECEBEB',
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  viewMesstext: {
    backgroundColor: '#ECEBEB',
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    padding: 10,
  },
  realmContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 5,
    maxWidth: '70%',
  },
  containerLink: {
    padding: 10,
    backgroundColor: '#ECEBEB',
    borderRadius: 16,
    borderBottomLeftRadius: 0,
  },
  containerInput: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mentionInput: {
    minWidth: 250,
    maxWidth: 250,
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'gray',
    padding: 10,
    fontSize: 14,
    paddingVertical: 10,
    height: 40,
    lineHeight: 20,
    paddingLeft: 10,
  },
});
