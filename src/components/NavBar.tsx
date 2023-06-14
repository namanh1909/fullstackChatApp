import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const NavBar = ({leftButton, title, rightButton, textStyle}: any) => {
  return (
    <View
      style={{
        height: 56,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: '#ECEBEB',
      }}>
      {leftButton}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          ...textStyle,
        }}>
        {title}
      </Text>
      <View
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          // borderWidth: 0.5,
        }}>
        {rightButton}
      </View>
    </View>
  );
};

export default NavBar;
