import {
  SET_CONNECT,
  UPDATE_USER,
  UPDATE_TOKEN,
  UPDATE_ACCOUNT_ID,
  GET_USER_FAIL,
  LOG_OUT,
} from './types';

export const setConnectData = data => ({
  type: SET_CONNECT,
  data,
});

export const setUserData = data => ({
  type: UPDATE_USER,
  data,
});

export const getUserFail = data => ({
  type: GET_USER_FAIL,
  data,
});

export const setAccountId = data => ({
  type: UPDATE_ACCOUNT_ID,
  data,
});

export const setToken = data => ({
  type: UPDATE_TOKEN,
  data,
});

export const logout = () => ({
  type: LOG_OUT,
});
