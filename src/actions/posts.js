import types from './types';

const fetchPostsStart = () = ({
  type: types.FETCH_POSTS_START,
});

const fetchPostsFinished = data = ({
  type: types.FETCH_POSTS_FINISHED,
  data
});

const fetchPostsError = error = ({
  type: types.FETCH_POSTS_ERROR,
  error
});

const fetchPosts = async = (dispatch, getState) => {
  dispatch(fetchPostsStart());
  try {
    const response = { ok: true, user: 'hello' };
    if (!response.ok) {
      throw new Error(response.statusMessage);
    }
    dispatch(fetchPostsFinished(response.user));
  } catch (error) {
    dispatch(fetchPostsError(error));
  }
}

const addPostStart = () = ({
  type: types.ADD_POST_START,
});

const addPostFinished = data = ({
  type: types.ADD_POST_FINISHED,
  data
});

const addPostError = error = ({
  type: types.ADD_POST_ERROR,
  error
});

const addPost = async = (dispatch, getState) => {
  dispatch(addPostStart());
  try {
    const response = { ok: true };
    if (!response.ok) {
      throw new Error(response.statusMessage);
    }
    dispatch(addPostFinished());
  } catch (error) {
    dispatch(addPostError(error));
  }
}