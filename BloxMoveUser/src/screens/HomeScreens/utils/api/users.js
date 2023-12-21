import api from './axios';
import {
  setUserData,
  getUserFail,
  setToken,
} from '../../../Onboarding/redux/index';
import deviceStorage from './../../../utils/AuthDeviceStorage';
import {displayErrors} from '../../../../helpers/displayErrors';
import messaging from '@react-native-firebase/messaging';

export function getUser(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.get('passenger', {
    headers: headers,
  });
}

export function updateUserData(data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.put('passenger', data, {headers: headers});
}

export async function updateDevceId(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const deviceId = await messaging().getToken();
    const data = {
      deviceId: deviceId,
    };
    return api.put('passenger/device-id', data, {
      headers: headers,
    });
  }
}
// Change Email
export async function changeEmail(data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.put('passenger/email', data, {headers: headers});
}
// Delete Account
export async function deleteAccount(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.delete('passenger', {
    headers: headers,
  });
}
// Delete Avatar
export async function deleteAvatar(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.delete('passenger/avatar', {
    headers: headers,
  });
}
// File Upload
export async function uploadFile(data, token) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    accept: 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('file', data.file);
  return api
    .post('utility/file-upload', formData, {
      headers: headers,
    })
    .then(response => {
      return {
        success: true,
        data: response.data.data.fileUrl,
      };
    })
    .catch(error => {
      displayErrors(error);
      return {
        success: false,
      };
    });
}

export function updateUserToken() {
  return async function (dispatch) {
    const accountId = await deviceStorage.getAccountNumber();
    const data = {
      walletAddress: accountId,
      timeStamp: new Date().getTime(),
      signature: '123',
    };
    return api
      .post('passenger/login', data)
      .then(response => {
        dispatch(
          setToken({
            token: response.data.data.token,
          }),
        );
      })
      .catch(error => {
        dispatch(getUserFail({error: true}));
      });
  };
}
