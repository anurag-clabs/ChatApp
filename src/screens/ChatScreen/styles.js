import {Platform, StyleSheet} from 'react-native';
import {ms, s, vs} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: vs(10),
    width: '100%',
    height: vs(45),
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
    width: ms(30),
    height: ms(30),
    marginRight: s(5),
    resizeMode: 'contain',
  },
  imagePopup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  buttonView: {
    height: ms(60),
    width: '50%',
    backgroundColor: '#007AFE',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vs(30),
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 30,
  },
});
