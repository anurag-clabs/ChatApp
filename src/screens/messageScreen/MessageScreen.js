import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {styles} from './styles';
import {images} from '../../assets/image';
import {s} from 'react-native-size-matters';
import {useRoute} from '@react-navigation/native';

const MessageScreen = ({navigation}) => {
  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
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
  }, []);

  const sendMessage = async (messages = []) => {
    if (inputMessage.trim() === '') {
      return;
    }
    const msg = messages[0];
    let myMsg = null;
    if (msg?.text?.length) {
      const text = msg.text;
      myMsg = {
        ...msg,
        text: text,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
      };
    }

    firestore()
      .collection('chats')
      .doc(`${route.params.id}${route.params.data.useId}`)
      .collection('messages')
      .add(myMsg);

    firestore()
      .collection('chats')
      .doc(`${route.params.data.useId}${route.params.id}`)
      .collection('messages')
      .add(myMsg);

    setInputMessage('');
    return myMsg;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const Message = {
        _id: `${Date.now()}`,
        text: inputMessage,
        createdAt: new Date(),
        user: {
          _id: route?.params?.id,
        },
      };
      sendMessage([Message, route.params.data.useId]);
      setMessageList(prevMessages => [...prevMessages, Message]);
      setInputMessage('');
    }
  };

  const renderItem = ({item}) => {
    const isCurrentUser = route?.params?.id === item.user._id;

    return (
      <View style={isCurrentUser ? styles.flexEnd : styles.flexStart}>
        <View style={styles.messageContainer}>
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isCurrentUser ? '#396f0e' : '#545454',
                borderTopLeftRadius: isCurrentUser ? 15 : 2,
                borderTopRightRadius: isCurrentUser ? 2 : 15,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
            ]}>
            <Text style={{color: '#ffff'}}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messageList}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        inverted={true}
      />
      <View style={styles.sectionStyle}>
        <TextInput
          placeholderTextColor="#666666"
          style={[styles.inputStyle]}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={text => setInputMessage(text)}
        />
        <View style={{position: 'absolute', right: s(5), flexDirection: 'row'}}>
          <TouchableOpacity onPress={null}>
            <Image style={styles.attach} source={images.attach} />
          </TouchableOpacity>
          <TouchableOpacity onPress={null}>
            <Image style={styles.imageStyle} source={images.image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={null}>
            <Image style={styles.imageStyle} source={images.voice} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendMessage}>
            <Image style={styles.send} source={images.send} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MessageScreen;
