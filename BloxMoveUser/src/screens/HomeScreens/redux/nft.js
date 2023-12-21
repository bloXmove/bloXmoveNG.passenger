import {SET_NFTICKET} from './types';

export const initialData = [];

const initialState = {
  nft: {},
};

export const nft = (state = initialState, action) => {
  switch (action.type) {
    case SET_NFTICKET:
      return {
        ...state,
        nft: action.data.data,
      };
    default:
      return state;
  }
};
