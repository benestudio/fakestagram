import types from '../actions/types';

const initialState = {
  isFetching: false,
  hasError: false,
  errorMessage: '',
  data: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_POSTS_FINISHED: {
      const { data } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        data,
      };
    }
    case types.FETCH_POSTS_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        hasError: true,
        data: null,
        errorMessage: error,
      };
    }
    case types.ADD_POST_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.ADD_POST_FINISHED: {
      const { data } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        data: [...initialState.data, ...data],
      };
    }
    case types.ADD_POST_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        hasError: true,
        errorMessage: error,
      };
    }
    default: {
      return state;
    }
  }
};
