import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

​import todo from './todo'
​
const reducers = combineReducers({
  todo
})
​
export default reducers