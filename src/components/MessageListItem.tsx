import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserList} from '../services/redux/action/user';
import {LinkPreview} from '@flyerhq/react-native-link-preview';

const MessageListItem = ({message}: any) => {
  const dispath = useDispatch();

  useEffect(() => {
    dispath(getUserList());
  }, []);

  let userList = useSelector((state: any) => state.user.userList);

  const userMatch = userList.find((user: any) =>
    message.includes(`@${user.name}`),
  );
  if (userMatch) {
    const regex = new RegExp(`@${userMatch.name}\\s+(.*)`, 'i');
    const match = message.match(regex);
    const messageText = match[1];

    if (match) {
      return (
        <Text>
          <Text style={{fontWeight: 'bold'}}>@{userMatch.name}</Text>{' '}
          {messageText}
        </Text>
      );
    } else {
      return <LinkPreview text={messageText} />;
    }
  }
  return <LinkPreview text={message} />;
};

export default MessageListItem;

const styles = StyleSheet.create({});
