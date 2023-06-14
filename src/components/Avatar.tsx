import {Image} from 'react-native';
import React from 'react';

const Avatar = ({size, uri, styles}: any) => {
  return (
    <Image
      source={{uri: uri}}
      style={{
        height: size ? size : 60,
        width: size ? size : 60,
        borderRadius: size ? size / 2 : 30,
        ...styles,
      }}
    />
  );
};

export default Avatar;
