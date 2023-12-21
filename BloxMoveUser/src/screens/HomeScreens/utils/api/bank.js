import {setBankList, setUserBank} from '../../redux/actions';
import api from './axios';

export function getBank(token) {
  return function async(dispatch) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    return api
      .get('passenger/bank-account', {headers: headers})
      .then(response => {
        dispatch(setUserBank({data: response.data.data}));
      })
      .catch(error => {
        if (error.response) {
          console.log('Error Response: ', error.response.data.message);
        } else if (error.request) {
          console.log('Error Request :', error.request);
        } else {
          console.log('Error', error.message);
        }
      });
  };
}
export function updateBank(token, data) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.put('passenger/bank-account', data, {headers: headers});
}

// Get Bank List
export function getBankList(token) {
  return function async(dispatch) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    return api
      .get('payment/bank', {
        headers: headers,
      })
      .then(response => {
        dispatch(
          setBankList({
            data: response.data.data,
            loading: false,
          }),
        );
      })
      .catch(error => {
        if (error.response) {
          console.log('Error Response: ', error.response.data.message);
        } else if (error.request) {
          console.log('Error Request :', error.request);
        } else {
          console.log('Error', error.message);
        }
        // dispatch(getUserFail({error: true}));
      });
  };
}
