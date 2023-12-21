import {
  SET_TRANSACTION_LIST,
  SET_RATE,
  SET_BANK_LIST,
  SET_NGN,
  SET_BLXM,
  SET_USDC,
  SET_BANK,
  SET_NFTICKET,
  UPDATE_LOADING,
  SET_PAGE_NUMBER,
  UPDATE_TRANSACTION_LIST,
  SET_PAYMENT_NUMBER,
} from './types';

export const initialData = [];
export const rates = [];

const initialState = {
  transactionList: initialData,
  rates: [],
  bankList: [],
  bank: {},
  loading: true,
  ngn: 0,
  blxm: 0,
  usdc: 0,
  nft: {},
  approvePayment: 0,
  pageNum: 1,
};

export const payment = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION_LIST:
      return {
        ...state,
        transactionList: state.transactionList.concat(action.data.data),
        loading: action.data.loading,
      };
    case UPDATE_TRANSACTION_LIST:
      return {
        ...state,
        transactionList: action.data.data,
        loading: action.data.loading,
      };
    case SET_RATE:
      return {
        ...state,
        rates: action.data.data,
      };
    case SET_BANK_LIST:
      return {
        ...state,
        bankList: action.data.data,
      };
    case SET_NGN:
      return {
        ...state,
        ngn: action.data.data,
      };
    case SET_BLXM:
      return {
        ...state,
        blxm: action.data.data,
      };
    case SET_USDC:
      return {
        ...state,
        usdc: action.data.data,
      };
    case SET_BANK:
      return {
        ...state,
        bank: action.data.data,
      };
    case SET_NFTICKET:
      return {
        ...state,
        nft: action.data.data,
      };
    case UPDATE_LOADING:
      return {
        ...state,
        loading: action.data.loading,
      };
    case SET_PAGE_NUMBER:
      return {
        ...state,
        pageNum: action.data.pageNum,
      };
    case SET_PAYMENT_NUMBER:
      return {
        ...state,
        approvePayment: action.data.data,
      };
    default:
      return state;
  }
};
