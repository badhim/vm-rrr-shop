import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminUsers from '../components/AdminUsers';

ReactDOM.render(
  <StrictMode>
  <Router>
    <Switch>
      <Route path="/admin/users" component={AdminUsers} />
    </Switch>
  </Router>
  </StrictMode>,
  document.getElementById('admin_users')
);
