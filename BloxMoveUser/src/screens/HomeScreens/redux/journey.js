import {SET_JOURNEY, SET_CURRENT, SET_ACCPETED} from './types';

export const initialData = [];

const initialState = {
  journeyList: initialData,
  currentJourney: {},
  acceptedJourney: {},
  loading: true,
};

export const journey = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOURNEY:
      return {
        ...state,
        journeyList: action.data.data,
        loading: action.data.loading,
      };
    case SET_CURRENT:
      return {
        ...state,
        currentJourney: action.data.data,
        loading: false,
      };
    case SET_ACCPETED:
      return {
        ...state,
        acceptedJourney: action.data.data,
        loading: false,
      };
    default:
      return state;
  }
};
