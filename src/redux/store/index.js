import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../reducers'
import initState from './init'

const routeMiddleware = routerMiddleware(browserHistory)
const store = createStore(
  reducers,
  initState,
  compose(
    applyMiddleware(thunkMiddleware, routeMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store