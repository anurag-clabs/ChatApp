import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import {ms, s, vs} from 'react-native-size-matters';
import {images} from '../../assets/image';
import {styles} from './styles';
import ImagePicker from 'react-native-image-crop-picker';

const Chat = ({navigation}) => {
  const [messageList, setMessageList] = useState([]);
  const route = useRoute();

  const handleImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      const imageUri = image.path;

      // Generate a unique filename for the image
      const imageFileName = uuid.v4();

      // Create a reference to Firebase Storage
      const storageRef = storage().ref(`images/${imageFileName}`);

      // Upload the image
      const task = storageRef.putFile(imageUri);

      task.on(
        'state_changed',
        snapshot => {
          // You can monitor upload progress here if needed
        },
        error => {
          console.error('Image upload error:', error);
        },
        async () => {
          // Image uploaded successfully, get the download URL
          const downloadURL = await storageRef.getDownloadURL();

          // Create the image message
          const imageMessage = {
            _id: uuid.v4(),
            createdAt: new Date(),
            image: {
              uri: downloadURL,
            },
            user: {
              _id: route.params.id,
            },
          };

          // Send the image message
          onSend([imageMessage]);
        },
      );
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

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
    let myMsg = null;
    if (msg.text) {
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
      };
    } else if (msg.image) {
      const imageUri = msg.image.uri;
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        image: imageUri, // Update the image field with the image URL
      };
    }

    if (myMsg) {
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
    }
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
        alwaysShowSend
        renderSend={props => {
          return (
            <View style={styles.imageView}>
              <TouchableOpacity
                onPress={() => {
                  alert('attach clicked');
                }}>
                <Image source={images.attach} style={styles.attach} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  alert('attach mic');
                }}>
                <Image source={images.voice} style={styles.image} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImage}>
                <Image source={images.image} style={styles.image} />
              </TouchableOpacity>
              <Send {...props} containerStyle={{justifyContent: 'center'}}>
                <Image source={images.send} style={styles.send} />
              </Send>
            </View>
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                borderRadius: 10,
                backgroundColor: 'white',
                borderTopColor: 'transparent',
              }}
            />
          );
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
