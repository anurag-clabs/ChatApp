import {StyleSheet} from 'react-native';
import {ms, s, vs} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: vs(10),
    width: '100%',
    height: vs(45),
  },
  sectionStyle: {
    height: vs(50),
    width: '90%',
    marginTop: vs(20),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    marginBottom: 10,
  },
  imageStyle: {
    height: ms(22),
    width: ms(22),
    resizeMode: 'contain',
    marginRight: s(5),
  },
  inputStyle: {
    paddingLeft: s(10),
    width: '90%',
    color: '#000',
    height: vs(50),
  },
  menuView: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    height: ms(46),
    width: ms(46),
    borderRadius: 10,
    backgroundColor: '#EFF0F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(18),
  },
  back: {
    width: ms(15),
    height: ms(15),
  },
  menuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#242424',
  },
  imageView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(40),
  },
  image: {
    width: ms(25),
    height: ms(25),
    marginRight: s(5),
    resizeMode: 'contain',
  },
  attach: {
    width: ms(20),
    height: ms(20),
    marginRight: s(5),
    resizeMode: 'contain',
  },
  send: {
    width: ms(25),
    height: ms(25),
    // marginTop: vs(10),
    // alignSelf: 'center',
    alignItems: 'center',
    // marginRight: s(5),
    resizeMode: 'contain',
  },
  imagePopup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  VideoPopup: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  buttonView: {
    height: ms(60),
    width: '30%',
    backgroundColor: '#007AFE',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vs(30),
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 30,
  },
  videoButton: {
    width: ms(20),
    height: ms(20),
    // marginRight: s(5),
    resizeMode: 'contain',
  },
  flexStart: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  flexEnd: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  messageContainer: {
    maxWidth: '80%',
  },
  messageBubble: {
    padding: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#dcdcdc',
    marginTop: 5,
  },
});