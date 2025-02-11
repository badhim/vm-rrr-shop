import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminItems from '../components/AdminItems';

ReactDOM.render(
  <StrictMode>
  <Router>
    <Switch>
      <Route path="/admin/items" component={AdminItems} />
    </Switch>
  </Router>
  </StrictMode>,
  document.getElementById('admin_items')
);
