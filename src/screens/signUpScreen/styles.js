import {StyleSheet} from 'react-native';
import {ms, s, vs} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flax: 1,
  },
  menuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#242424',
  },
  contact: {
    fontSize: 15,
    marginHorizontal: s(3),
    paddingTop: vs(10),
    marginBottom: vs(5),
    color: '#242424',
  },
  input: {
    height: ms(60),
    borderWidth: 1,
    backgroundColor: '#DEEBFF',
    borderRadius: 10,
    borderColor: '#DEEBFF',
    fontSize: 18,
    paddingLeft: s(15),
    color: '#242424',
  },
  buttonView: {
    height: ms(60),
    width: '100%',
    backgroundColor: '#007AFE',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vs(20),
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 30,
  },
  login: {
    fontWeight: '800',
    fontSize: 18,
    textDecorationLine: 'underline',
    color: '#000',
  },
});
