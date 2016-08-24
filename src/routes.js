import React from 'react';
import {Route, IndexRoute} from 'react-router';

import TodoApp from './components/TodoApp';

export default (
  <Route path="/">
  	<IndexRoute component={TodoApp}/>
  </Route>
);
