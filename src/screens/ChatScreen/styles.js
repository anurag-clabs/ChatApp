import {StyleSheet} from 'react-native';
import {ms, s} from 'react-native-size-matters';

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
});
