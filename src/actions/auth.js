import types from './types';

const loginStart = () = ({
  type: types.LOGIN_START,
});

const loginFinished = user = ({
  type: types.LOGIN_FINISHED,
  user
});

const loginError = error = ({
  type: types.LOGIN_ERROR,
  error
});

const loginUser = async = (dispatch, getState) => {
  dispatch(loginStart());
  try {
    const response = { ok: true, user: 'hello' };
    if (!response.ok) {
      throw new Error(response.statusMessage);
    }
    dispatch(loginFinished(response.user));
  } catch (error) {
    dispatch(loginError(error));
  }
}