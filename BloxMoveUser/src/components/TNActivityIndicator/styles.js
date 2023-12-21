import {StyleSheet} from 'react-native';

const styles = (appStyles, colorScheme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    indicatorContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    logoImg: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
  });

export default styles;
