import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

const SearchInput = ({value, onChangeText, styles}: any) => {
  return (
    <View
      style={{
        height: 36,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        margin: 10,
        borderColor: '#ECEBEB',
        borderRadius: 18,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        ...styles,
      }}>
      <IonIcons
        size={20}
        name="search-outline"
        style={{
          marginRight: 10,
        }}
      />
      <TextInput
        placeholder="Search"
        style={{
          fontSize: 14,
        }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchInput;
