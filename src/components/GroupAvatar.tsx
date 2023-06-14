import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React from 'react';

const GroupAvatar = ({item}: any) => {
  if (item) {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: 20,
        }}>
        {item?.length == 1 && (
          <FlatList
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
            data={item}
            numColumns={2}
            renderItem={({item}) => {
              return (
                <Image source={{uri: item}} style={{height: 40, width: 40}} />
              );
            }}
          />
        )}
        {item?.length == 2 && (
          <Image
            source={{uri: item[1]}}
            style={{height: 40, width: 40, borderRadius: 20}}
          />
        )}
        {item?.length == 3 && (
          <FlatList
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
            contentContainerStyle={{
              flexDirection: 'row',
            }}
            data={item}
            // numColumns={2}
            horizontal
            renderItem={({item, index}: any) => {
              if (index == 0) {
                return (
                  <Image source={{uri: item}} style={{height: 40, width: 20}} />
                );
              }
              return (
                <Image source={{uri: item}} style={{height: 20, width: 20}} />
              );
            }}
          />
        )}
        {item?.length == 4 && (
          <FlatList
            numColumns={2}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
            data={item}
            renderItem={({item, index}) => {
              if (index == 0) {
                return (
                  <Image
                    source={{uri: item}}
                    style={{height: 20, width: 20, borderTopLeftRadius: 20}}
                  />
                );
              }
              if (index == 1) {
                return (
                  <Image
                    source={{uri: item}}
                    style={{height: 20, width: 20, borderTopRightRadius: 20}}
                  />
                );
              }
              if (index == 2) {
                return (
                  <Image
                    source={{uri: item}}
                    style={{height: 20, width: 20, borderBottomLeftRadius: 20}}
                  />
                );
              } else {
                return (
                  <Image
                    source={{uri: item}}
                    style={{height: 20, width: 20, borderBottomRightRadius: 20}}
                  />
                );
              }
            }}
          />
        )}
      </View>
    );
  } else {
    return null;
  }
};

export default GroupAvatar;

const styles = StyleSheet.create({
  container: {},
});
