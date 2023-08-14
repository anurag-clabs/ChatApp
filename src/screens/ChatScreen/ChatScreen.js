import {View, Text, TouchableOpacity, Image, Modal, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import {images} from '../../assets/image';
import {styles} from './styles';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {s, vs} from 'react-native-size-matters';

const Chat = ({navigation}) => {
  const [messageList, setMessageList] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState('');
  const route = useRoute();

  const handleImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      const imageUri = image.path;
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

          onSend([imageMessage]);
        },
      );
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const downloadImageToGallery = async () => {
    try {
      const resp = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
      }).fetch('GET', selectedImageURL);
      setShowImage(false);

      const base64Data = await resp.readFile('base64');
      const {dirs} = RNFetchBlob.fs;
      const timestamp = Date.now();
      const galleryPath = `${dirs.DownloadDir}/downloaded_image_${timestamp}.jpg`;

      await RNFetchBlob.fs.writeFile(galleryPath, base64Data, 'base64');

      RNFetchBlob.fs.scanFile([{path: galleryPath, mime: 'image/jpeg'}]);
      Alert.alert('Download', 'Image downloaded successfully!');
      console.log('Image downloaded successfully:', resp.path());
    } catch (error) {
      console.log('Image download error:', error);
    }
  };

  const handleImagePress = imageURL => {
    setSelectedImageURL(imageURL);
    setShowImage(true);
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
      const imageUri = msg.image.uri;
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        image: imageUri,
      };
    } else if (msg.image) {
      const imageUri = msg.image.uri;
      console.log('Image URI:', imageUri);
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        image: imageUri,
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
      downloadImageToGallery(msg.image.uri);
      firestore()
        .collection('chats')
        .doc('' + route.params.data.useId + route.params.id)
        .collection('messages')
        .add(myMsg);
    }
  }, []);

  const renderMessageImage = props => {
    return (
      <TouchableOpacity
        onLongPress={() => handleImagePress(props?.currentMessage.image)}>
        <Image
          style={{width: 170, height: 150}}
          source={{uri: props?.currentMessage.image}}
        />
      </TouchableOpacity>
    );
  };
  const renderSend = props => {
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
  };

  const renderInputToolbar = props => {
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
  };

  const renderBubble = props => {
    return (
      <Bubble {...props} wrapperStyle={{left: {backgroundColor: '#DEEBFF'}}} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuView}
          onPress={() => navigation.goBack()}>
          <Image source={images.back} style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Chat</Text>
      </View>
      {showImage && (
        <Modal animationType="slide" transparent={true} visible={showImage}>
          <View style={styles.imagePopup}>
            <TouchableOpacity onPress={() => setShowImage(false)}>
              <Image
                style={{
                  width: s(200),
                  height: vs(150),
                }}
                source={{uri: selectedImageURL}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonView}
              onPress={downloadImageToGallery}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <GiftedChat
        messages={messageList}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
        alwaysShowSend
        renderMessageImage={renderMessageImage}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
      />
    </View>
  );
};

export default Chat;
