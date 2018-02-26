import { combineReducers } from 'redux';

import auth from './auth';
import posts from './posts';

export default combineReducers({
  auth,
  posts,
});
