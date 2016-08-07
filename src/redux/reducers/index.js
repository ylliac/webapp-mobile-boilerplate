import {combineReducers} from 'redux';

import todos from './todo';

const reducers = combineReducers({
  todos
});

export default reducers;
