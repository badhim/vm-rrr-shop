import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PagesMyOrders from '../components/PagesMyOrders';

ReactDOM.render(
  <StrictMode>
  <Router>
    <Switch>
      <Route exact path="/my_orders" component={PagesMyOrders} />
    </Switch>
  </Router>
  </StrictMode>,
  document.getElementById('pages_my_orders')
);
