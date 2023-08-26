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
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

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
    } else if (msg?.image?.uri?.length) {
      const imageUri = msg?.image?.uri;
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        image: imageUri,
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
      console.log('Message=====>', Message);
      sendMessage(Message);

      setInputMessage('');
    }
  };

  const handleSendImage = async () => {
    try {
      const selectedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      const imageUri = selectedImage.path;
      const imageFileName = uuid.v4();
      const storageRef = storage().ref(`images/${imageFileName}`);
      const task = storageRef.putFile(imageUri);

      task.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.error('Image upload error:', error);
        },
        async () => {
          const downloadURL = await storageRef.getDownloadURL();

          const ImageMessage = {
            _id: `${Date.now()}`,
            image: downloadURL,
            createdAt: new Date(),
            user: {
              _id: route?.params?.id,
            },
          };
          console.log('ImageMessage=====>', ImageMessage);
          sendMessage(ImageMessage); // Send only the ImageMessage object

          setMessageList(prevMessages => [...prevMessages, ImageMessage]);
          setInputMessage('');
        },
      );
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const formatTime1 = date => {
    const d = new Date(date);
    const hours = d.getHours() % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
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
            {item.text && <Text style={{color: '#ffff'}}>{item.text}</Text>}
            {item.image && (
              <Image
                source={{uri: item.image}}
                style={{width: 200, height: 150, borderRadius: 10}}
              />
            )}
            <Text style={styles.timestamp}>{formatTime1(item.createdAt)}</Text>
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
          <TouchableOpacity onPress={handleSendImage}>
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
