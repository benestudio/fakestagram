import firebase from 'react-native-firebase';

import types from './types';

const loginStart = () => ({
  type: types.LOGIN_START,
});

const loginFinished = user => ({
  type: types.LOGIN_FINISHED,
  user,
});

const loginError = error => ({
  type: types.LOGIN_ERROR,
  error,
});

export const loginUser = (email, pass) => async (dispatch, getState) => {
  dispatch(loginStart());
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass);
    console.log(response);
    if (response.error) {
      throw new Error(response);
    }
    dispatch(loginFinished(response.user));
  } catch (error) {
    console.log(error);
    dispatch(loginError(error));
  }
};

const logoutStart = () => ({
  type: types.LOGOUT_START,
});

const logoutFinished = () => ({
  type: types.LOGOUT_FINISHED,
});

const logoutError = error => ({
  type: types.LOGOUT_ERROR,
  error,
});

export const logoutUser = () => async (dispatch, getState) => {
  dispatch(logoutStart());
  try {
    firebase.auth().signOut();
    dispatch(logoutFinished());
  } catch (error) {
    dispatch(logoutError(error));
  }
};
