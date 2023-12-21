import {getDeviceId, openSetting} from '@app/src/helpers';
import {getBank, getBankList} from '../../HomeScreens/utils/api/bank';
import {getRates} from '../../HomeScreens/utils/api/payment';
import {
  setAccountId,
  setToken,
  setUserData,
} from '../../Onboarding/redux/actions';
import deviceStorage from '../AuthDeviceStorage';
import api from './axios';
import {ethers} from 'ethers';
import {journeyAPI} from '@app/src/screens/HomeScreens/utils';

export const getToken = async accountId => {
  const signature = await deviceStorage.getSigature();
  const timeStamp = await deviceStorage.getSigTime();
  const tokenPermission = await getDeviceId();
  if (tokenPermission === 'fail') {
    openSetting(
      'Please allow notification permission to get the push notification',
    );
    return;
  }
  const data = JSON.stringify({
    walletAddress: ethers.utils.getAddress(
      String(accountId).toLowerCase().trim(),
    ),
    timestamp: parseInt(timeStamp, 10),
    signature: signature,
    deviceId: tokenPermission,
  });
  console.log(data);
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return api
    .post('passenger/login', data, {headers: headers})
    .then(async response => {
      await deviceStorage.setAccessToken(response.data.data.token);
      await deviceStorage.setExpired(response.data.data.expiredAt.toString());
      return {
        success: true,
        data: response.data.data,
      };
    })
    .catch(error => {
      var status = '';
      if (error.response) {
        status = error.response.status;
        console.log('Token Error Response: ', error.response.data);
      } else if (error.request) {
        console.log('Token Error Request: ', error.request);
      } else {
        console.log('Token Error: ', error.message);
      }
      return {
        success: false,
        status: status,
        error: error,
      };
    });
};

export const createAccount = async data => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return api.post('passenger', data, {headers});
};

export const updateEmail = async data => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return api.put('passenger/update-unverified', data, {headers: headers});
};

export const sendVerification = async data => {
  return api.get('passenger/verify-email?token=' + data, '');
};

export const resendVerification = async data => {
  return api.post('passenger/' + data + '/resend-email');
};

export const verifyToken = async data => {
  return api.get('passenger/get-token-by-wallet?walletAddress=' + data, '');
};

export const getEmailStatus = async data => {
  return api.get('passenger/' + data + '/email-status', '');
};

export const getUserInfo = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api
    .get('passenger', {
      headers: headers,
    })
    .then(response => {
      return {
        success: true,
        data: response.data.data,
      };
    })
    .catch(error => {
      return {
        success: false,
      };
    });
};

export function getPassenger(token) {
  return function async(dispatch) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    return api
      .get('passenger', {
        headers: headers,
      })
      .then(response => {
        dispatch(setUserData({user: response.data.data}));
      })
      .catch(error => {});
  };
}

export async function getNFTDataAddress() {
  return api
    .get('utility/address')
    .then(async response => {
      await deviceStorage.setNFTADDRESS(JSON.stringify(response.data.data));
    })
    .catch(error => {});
}
export async function getNFTABI() {
  return api
    .get('utility/abi')
    .then(async response => {
      await deviceStorage.setNFTAbi(JSON.stringify(response.data.data));
    })
    .catch(error => {});
}

export const getVersions = async () => {
  return api
    .get('/utility/app-versions', '')
    .then(async response => {
      const data = response.data.data;
      return {
        success: true,
        data: data,
      };
    })
    .catch(error => {
      return {
        success: false,
        error: error,
      };
    });
};

export function loginActions(token, accountId) {
  return async function async(dispatch) {
    dispatch(setToken({token: token}));
    dispatch(setAccountId({accountId: accountId}));
    dispatch(getRates(token));
    dispatch(getBankList(token));
    await dispatch(journeyAPI.getCurrentJourney(token));
    await dispatch(getPassenger(token));
    dispatch(getBank(token));
    // updateDevceId(token);
    // await getNFTDataAddress();
    await getNFTABI();
  };
}
