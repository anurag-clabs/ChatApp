import {Dimensions, StyleSheet} from 'react-native';
import {ms, s} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#242424',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#242424',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: '90%',
    height: ms(60),
    borderWidth: 1,
    backgroundColor: '#DEEBFF',
    borderRadius: 10,
    borderColor: '#DEEBFF',
    fontSize: 18,
    paddingLeft: s(15),
    color: '#242424',
    alignSelf: 'center',
    marginTop: 20,
  },
  userIcon: {
    width: ms(40),
    height: ms(40),
    marginTop: 10,
  },
  name: {
    color: '#000',
    marginLeft: 20,
    fontSize: 20,
    marginTop: 10,
  },
});
