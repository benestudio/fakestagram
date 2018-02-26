import types from '../actions/types';

const initialState = {
  loggedIn: false,
  isFetching: false,
  hasError: false,
  errorMessage: '',
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.LOGIN_FINISHED: {
      const { user } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        user,
      };
    }
    case types.LOGIN_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        hasError: true,
        user: null,
        errorMessage: error.message,
      };
    }
    case types.LOGOUT_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.LOGOUT_FINISHED: {
      return {
        ...initialState,
      };
    }
    case types.LOGOUT_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        hasError: true,
        errorMessage: error,
      };
    }
    default: {
      return state;
    }
  }
};
