import {StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import HomeScreens from '../screens/HomeScreen';
import {useDispatch} from 'react-redux';
import {getListRoom} from '../services/redux/action/roomChat';
import {getMentions} from '../services/redux/action/mentions';
import MentionScreen from '../screens/MentionScreen';

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreens}
        options={{
          tabBarIcon: () => {
            return <IonIcons name="chatbox-outline" size={20} />;
          },
          title: 'Chats',
        }}
        listeners={{
          tabPress: () => dispatch(getListRoom()),
        }}
      />
      <Tab.Screen
        name="Mention"
        component={MentionScreen}
        options={{
          tabBarIcon: () => {
            return <IonIcons name="at-outline" size={20} />;
          },
          title: 'Mentions',
        }}
        listeners={{
          tabPress: () => dispatch(getMentions()),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({});
