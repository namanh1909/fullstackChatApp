import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useDispatch} from 'react-redux';
import {
  LoginGoogle,
  loginWithEmail,
  RegisterWithEmail,
  saveUser,
} from '../../services/redux/action/auth';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(saveUser(email, password, username));
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/bg.png')}
        style={styles.background}
      />
      <SafeAreaView style={styles.topView}>
        <Text style={styles.title}>{!isLogin ? 'Register' : 'Login'}</Text>
        <View style={styles.inputView}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Ionicons name="person-outline" color="#D9D9D9" size={18} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              style={styles.input}
            />
          </View>
        </View>

        {!isLogin && (
          <View style={styles.inputView}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Ionicons name="person-outline" color="#D9D9D9" size={18} />
              <TextInput
                value={username}
                onChangeText={value => setUsername(value)}
                placeholder="Username"
                style={styles.input}
              />
            </View>
          </View>
        )}

        <View style={styles.inputView}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Ionicons name="lock-closed-outline" color="#D9D9D9" size={18} />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={value => setPassword(value)}
              placeholder="Password"
              style={styles.input}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!isLogin) {
              dispatch(RegisterWithEmail());
            } else {
              dispatch(saveUser(email, password, username));
              dispatch(loginWithEmail());
            }
          }}
          style={styles.button}>
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
            }}>
            {!isLogin ? 'Register' : 'Login'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View
        style={{
          marginTop: 50,
          alignItems: 'center',
          flex: 0.3,
        }}>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 12,
            color: '#7A7A7A',
          }}>
          or connect with
        </Text>
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => {
              // onFacebookButtonPress();
            }}
            style={styles.socialButton}>
            <Ionicons
              name="logo-facebook"
              color={'#fff'}
              style={{marginRight: 10}}
            />
            <Text
              style={{
                color: '#fff',
              }}>
              Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(LoginGoogle());
            }}
            style={styles.socialButton}>
            <Ionicons
              name="logo-google"
              color={'#fff'}
              style={{marginRight: 10}}
            />
            <Text
              style={{
                color: '#fff',
              }}>
              Google
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 60,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: '#7A7A7A',
            }}>
            Already have an Account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: '#6A74CF',
              }}>
              {isLogin ? 'Register' : 'Login In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    position: 'absolute',
    height: '70%',
  },
  topView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.7,
  },
  title: {
    fontWeight: '600',
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  inputView: {
    height: 40,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 67,
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 40,
  },
  input: {
    marginLeft: 20,
    fontSize: 12,
    color: '#D9D9D9',
    width: '70%',
  },
  button: {
    height: 40,
    width: '70%',
    backgroundColor: '#6A74CF',
    borderRadius: 67,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 40,
  },
  socialButton: {
    width: 150,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#35A6EF',
    borderRadius: 20,
    flexDirection: 'row',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
    width: '100%',
  },
});
