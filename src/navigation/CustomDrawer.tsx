import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {LogOut} from '../services/redux/action/auth';

const CustomDrawer = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = auth().currentUser;
  return (
    <SafeAreaView
      style={{
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <View
        style={{
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {user?.photoURL ? (
            <Image
              source={{uri: `${user?.photoURL}`}}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <IonIcons
                name="person-outline"
                size={20}
                style={{
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {user?.displayName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateRoom');
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
            }}>
            <IonIcons
              name="eyedrop-outline"
              size={18}
              color="#7A7A7A"
              style={{
                marginRight: 20,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
              }}>
              New Direct Message
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateRoom');
          }}
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <IonIcons
            name="people-outline"
            size={18}
            color="#7A7A7A"
            style={{
              marginRight: 20,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
            }}>
            New Group
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          // auth().signOut();
          dispatch(LogOut());
        }}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}>
        <IonIcons
          name="person-outline"
          size={18}
          color="#7A7A7A"
          style={{
            marginRight: 20,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
          }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
