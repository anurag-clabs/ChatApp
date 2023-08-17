import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  LogBox,
} from 'react-native';
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
import Video from 'react-native-video';
LogBox.ignoreLogs(['Require cycle:']);

const Chat = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState('');
  const [selectedVideoURL, setSelectedVideoURL] = useState('');
  const route = useRoute();

  const handleVideo = async () => {
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
      });

      const videoUri = video.path;
      const videoFileName = uuid.v4();
      const storageRef = storage().ref(`videos/${videoFileName}`);
      const task = storageRef.putFile(videoUri);

      task.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.error('Video upload error:', error);
        },
        async () => {
          const downloadURL = await storageRef.getDownloadURL();

          const videoMessage = {
            _id: uuid.v4(),
            createdAt: new Date(),
            video: {
              uri: downloadURL,
            },
            user: {
              _id: route.params.id,
            },
          };

          onSend([videoMessage]);
        },
      );
    } catch (error) {
      console.log('Video picker error:', error);
    }
  };

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
      console.log('Image downloaded successfully:', resp.path());
    } catch (error) {
      console.log('Image download error:', error);
    }
  };

  const downloadVideoToGallery = async () => {
    try {
      const resp = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'mp4',
      }).fetch('GET', selectedVideoURL);
      setShowVideo(false);

      const base64Data = await resp.readFile('base64');
      const {dirs} = RNFetchBlob.fs;
      const timestamp = Date.now();
      const galleryPath = `${dirs.DownloadDir}/downloaded_video_${timestamp}.MOV`;

      await RNFetchBlob.fs.writeFile(galleryPath, base64Data, 'base64');

      RNFetchBlob.fs.scanFile([{path: galleryPath, mime: 'video/mp4'}]);
      console.log('Video downloaded successfully:', resp.path());
    } catch (error) {
      console.log('Video download error:', error);
    }
  };

  const handleImagePress = imageURL => {
    setSelectedImageURL(imageURL);
    setShowImage(true);
  };
  const handleVideoPress = videoURL => {
    setSelectedVideoURL(videoURL);
    setShowVideo(true);
    setIsPlaying(p => !p);
    setIsMuted(m => !m);
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
    // return () => subscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    let myMsg = null;
    if (msg?.text?.length) {
      const text = msg.text;
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        text: text,
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
    } else if (msg?.video?.uri?.length) {
      const videoUri = msg?.video?.uri;
      myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.useId,
        createdAt: Date.parse(msg.createdAt),
        video: videoUri,
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
      downloadImageToGallery(msg?.image?.uri);
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
          style={{width: 170, height: 150, resizeMode: 'contain'}}
          source={{uri: props?.currentMessage.image}}
        />
      </TouchableOpacity>
    );
  };
  const renderMessageVideo = props => {
    return (
      <TouchableOpacity
        onLongPress={() => handleVideoPress(props?.currentMessage.video)}>
        <Video
          style={{width: s(235), height: vs(150)}}
          source={{uri: props?.currentMessage.video}}
          paused={!isPlaying}
          controls={true}
          muted={isMuted}
          repeat={false}
        />
      </TouchableOpacity>
    );
  };
  const renderSend = props => {
    return (
      <View style={styles.imageView}>
        <TouchableOpacity onPress={handleVideo}>
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
                  width: s(300),
                  height: vs(450),
                  resizeMode: 'cover',
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
      {showVideo && (
        <Modal animationType="slide" transparent={true} visible={showVideo}>
          <View style={styles.VideoPopup}>
            <Video
              style={{
                width: s(340),
                height: vs(550),
                alignSelf: 'center',
              }}
              source={{uri: selectedVideoURL}}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={styles.buttonView}
                onPress={downloadVideoToGallery}>
                <Text style={styles.buttonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonView}
                onPress={() => setShowVideo(false)}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
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
        renderMessageVideo={renderMessageVideo}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
      />
    </View>
  );
};

export default Chat;
