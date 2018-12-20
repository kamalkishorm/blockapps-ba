import { takeLatest, put, call } from 'redux-saga/effects';
import {
  ME,
  authenticatedSuccess,
  authenticatedFailure,
  GET_USER,
  getUserFailure,
  getUserSuccess,
  USER_LOGOUT
} from './login.actions';
import { API_URL } from '../../environment';
import { setChainID } from '../../components/Chains/chains.actions';
import { setUserMessage } from '../../components/UserMessage/user-message.action';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const meUrl = API_URL + '/me';
const getUserUrl = API_URL + '/users/:address';
const logoutUrl = API_URL + '/authentication/logout';

function meCall() {
  return fetch(meUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      return error.json();
    });
}

function getUserApiCall(data) {
  const url = `${getUserUrl.replace(':address', data.address)}?chainId=${data.chainId}`;
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      return error.json();
    });
}

function logoutApiCall() {
  return fetch(logoutUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      return error.json();
    });
}

function* me() {
  try {
    const response = yield call(meCall);
    if (!response.success) {
      yield put(authenticatedFailure());
      window.location = response.error.loginUrl
    } else {
      yield put(authenticatedSuccess(response.data));
    }
  }
  catch (err) {
    yield put(authenticatedFailure());
  }
}

function* getUser(action) {
  try {
    yield put(showLoading());
    const response = yield call(getUserApiCall, action.data);
    yield put(setChainID(action.data.chainId));
    if (response.success) {
      yield put(getUserSuccess(response.data));
      yield put(hideLoading());
    } else {
      yield put(getUserFailure());
      yield put(setUserMessage(response.error))
      yield put(hideLoading());
    }
  }
  catch (err) {
    yield put(getUserFailure());
    yield put(hideLoading());
  }
}

function* userLogout() {
  try {
    const response = yield call(logoutApiCall);
    if (response.success)
      window.location = response.data.logoutUrl
  }
  catch (err) {
    console.error("Error logout:", err);
  }
}

export default function* watchLoginSubmit() {
  yield takeLatest(ME, me);
  yield takeLatest(GET_USER, getUser);
  yield takeLatest(USER_LOGOUT, userLogout);
}
