import {StyleSheet} from 'react-native';
import {ms, s, vs} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
