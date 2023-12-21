import {Platform, Linking, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import {getAddressFromCoordinates} from './getAddressName';

export const checkPermission = async () => {
  var permissionStatus = '';
  if (Platform.OS === 'android') {
    permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(async result => {
        return result;
      })
      .catch(error => {
        return 'fail';
      });
  } else {
    permissionStatus = await Geolocation.requestAuthorization('always');
  }
  return permissionStatus;
};

export const checkCameraPermission = async () => {
  var permissionStatus = '';
  if (Platform.OS === 'android') {
    permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA)
      .then(async result => {
        return result;
      })
      .catch(error => {
        return false;
      });
  } else {
    permissionStatus = await request(PERMISSIONS.IOS.CAMERA)
      .then(async result => {
        return result;
      })
      .catch(error => {
        return false;
      });
  }
  return permissionStatus;
};
export const openSetting = (text, title) => {
  Alert.alert(title && title !== '' ? title : '', text, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => Linking.openSettings(),
    },
  ]);
};

export const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      const permissionStatus = await checkPermission();
      if (permissionStatus !== 'granted') {
        resolve('fail');
      }
    }
    Geolocation.getCurrentPosition(
      pos => {
        resolve(pos);
      },
      async error => {
        // Alert.alert('', "Sorry, we can't get your location");
        if (Platform.OS === 'android') {
          await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        } else {
          await Geolocation.requestAuthorization('always');
        }
        resolve('fail');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      },
    );
  });
};

export const getCurrentData = async () => {
  const permissionStatus = await checkPermission();
  if (permissionStatus !== 'granted') {
    openSetting('Please allow location permission to start accepting rides');
    return 'fail';
  }
  const location = await getCurrentLocation();
  if (!location.coords) {
    return 'false';
  }
  const locations = await getAddressFromCoordinates(
    location.coords.latitude,
    location.coords.longitude,
  );
  const data = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    locationName: locations.long_name ? locations.long_name : 'Lagos',
    timestamp: Math.round(Date.now() / 1000),
  };
  return data;
};
