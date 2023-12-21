import {setCurrent} from '../../redux/actions';
import api from './axios';

export function getJourney(token, url) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.get('journey?' + url, {
    headers: headers,
  });
}

export function journeySearch(data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey-request/search', data, {headers: headers});
}

export function journeyRequestDetail(id, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.get('journey-request/' + id, {headers: headers});
}
// Create Journey Requeset after pay
export function createJourney(data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey-request', data, {headers: headers});
}

export function getJourneyCurrent(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.get('journey/current', {headers: headers});
}

// Cancel Journey Request before pay
export function journeyRequestCancel(id, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post(
    'journey-request/' + id + '/cancel',
    {},
    {
      headers: headers,
    },
  );
}
// Detail of Journey after they pay
export function journeyDetail(id, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.get('journey/' + id, {headers: headers});
}
// Start Journey
export function journeyStart(id, data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey/' + id + '/start', data, {headers: headers});
}
// Cancel Journey
export function journeyCancel(id, data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey/' + id + '/cancel', data, {
    headers: headers,
  });
}
// End Journey
export function journeyEnd(id, data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey/' + id + '/passenger-end', data, {headers: headers});
}

// Review Journey
export function journeyReview(id, data, token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api.post('journey/' + id + '/review', data, {headers: headers});
}

// Get the Current Journey
export function getCurrentJourney(token) {
  return function async(dispatch) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    return api
      .get('journey/current', {headers: headers})
      .then(response => {
        dispatch(
          setCurrent({
            data: response.data.data,
          }),
        );
      })
      .catch(error => {});
  };
}
export function getCurrentJourneyData(token) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api
    .get('journey/current', {headers: headers})
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
}
// Apply Coupon
export function applyCoupon(token, data, id) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  return api
    .post('journey-request/' + id + '/apply-ride-code', data, {
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
        error: error,
      };
    });
}
