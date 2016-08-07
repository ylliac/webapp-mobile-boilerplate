import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';

import store from './redux/store';

import TodoApp from './components/TodoApp';
import 'todomvc-app-css/index.css';

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={TodoApp}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
