import {
  SET_JOURNEY,
  SET_TRANSACTION_LIST,
  SET_RATE,
  SET_BANK_LIST,
  SET_BLXM,
  SET_USDC,
  SET_NGN,
  SET_BANK,
  SET_CURRENT,
  SET_ACCPETED,
  SET_NFTICKET,
  UPDATE_LOADING,
  SET_PAGE_NUMBER,
  UPDATE_TRANSACTION_LIST,
  SET_PAYMENT_NUMBER,
} from './types';
// NFT
export const setNFTBalance = data => ({
  type: SET_NFTICKET,
  data,
});
// Journey
export const setJourney = data => ({
  type: SET_JOURNEY,
  data,
});
export const setCurrent = data => ({
  type: SET_CURRENT,
  data,
});
export const setAccepted = data => ({
  type: SET_ACCPETED,
  data,
});
// Payments
export const setTransactionList = data => ({
  type: SET_TRANSACTION_LIST,
  data,
});
export const updateTransactionList = data => ({
  type: UPDATE_TRANSACTION_LIST,
  data,
});
export const setRate = data => ({
  type: SET_RATE,
  data,
});
export const setBankList = data => ({
  type: SET_BANK_LIST,
  data,
});
export const setNGN = data => ({
  type: SET_NGN,
  data,
});

export const setBLXM = data => ({
  type: SET_BLXM,
  data,
});

export const setUSDC = data => ({
  type: SET_USDC,
  data,
});

export const setUserBank = data => ({
  type: SET_BANK,
  data,
});
export const updatePaymentLoading = data => ({
  type: UPDATE_LOADING,
  data,
});
export const setPageNum = data => ({
  type: SET_PAGE_NUMBER,
  data,
});
export const setPaymentNumber = data => ({
  type: SET_PAYMENT_NUMBER,
  data,
});
