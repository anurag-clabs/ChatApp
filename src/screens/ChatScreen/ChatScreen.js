import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {vs} from 'react-native-size-matters';
import {images} from '../../assets/image';
import {styles} from './styles';

const Chat = ({navigation}) => {
  const [messageList, setMessageList] = useState([]);
  const route = useRoute();
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.useId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessageList(allmessages);
    });
    return () => subscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.useId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.useId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      .doc('' + route.params.data.useId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{marginTop: vs(10)}}>
        <TouchableOpacity
          style={styles.menuView}
          onPress={() => navigation.goBack()}>
          <Image source={images.back} style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Chat</Text>
      </View>
      <GiftedChat
        messages={messageList}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{left: {backgroundColor: '#DEEBFF'}}}
            />
          );
        }}
      />
    </View>
  );
};

export default Chat;
