import {Alert} from 'react-native';

export const connectValora = error => {
  if (error.response) {
    console.log('Error Response: ', error.response.data.message);
    Alert.alert(
      '',
      Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message,
    );
  } else if (error.request) {
    console.log('Error Request :', error.request);
  } else {
    console.log('Error', error.message);
  }
};
