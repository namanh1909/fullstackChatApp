import {createStackNavigator} from '@react-navigation/stack';
import useAuthorized from '../../hook/useAuth';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import TabNavigation from './TabNavigation';
import {RootStackParamsList} from '../services/entities';
import RoomChatScreen from '../screens/RoomChat';
import {useSelector} from 'react-redux';
import CreateGroupScreen from '../screens/RoomChat/components/CreateGroupScreen';
import SetNameGroupScreen from '../screens/RoomChat/components/SetNameGroupScreen';
import LoginScreen from '../screens/Authentication';

const OPTIONS = {
  noHeader: {
    headerShown: false,
  },
};

export type RootStackProps = {};

const RootStackNavigator = createStackNavigator<RootStackParamsList>();
const Drawer = createDrawerNavigator();

const RootStack: React.FC<RootStackProps> = () => {
  const {isAuthorized} = useAuthorized();

  let isLogin = useSelector((state: any) => state.auth.isLogin);

  if (isLogin || isAuthorized) {
    return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="Tab"
          component={TabNavigation}
          options={{
            drawerHideStatusBarOnOpen: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="RoomChat"
          component={RoomChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="CreateRoom"
          component={CreateGroupScreen}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="SetNameRoom"
          component={SetNameGroupScreen}
          options={{
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    );
  } else {
    return (
      <RootStackNavigator.Navigator screenOptions={{...OPTIONS.noHeader}}>
        <RootStackNavigator.Screen
          component={LoginScreen}
          name="UnAuth"
          options={{
            ...OPTIONS.noHeader,
          }}
        />
      </RootStackNavigator.Navigator>
    );
  }
};

export default RootStack;
