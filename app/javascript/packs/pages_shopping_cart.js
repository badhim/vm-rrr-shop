import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PagesShoppingCart from '../components/PagesShoppingCart';

ReactDOM.render(
  <StrictMode>
  <Router>
    <Switch>
      <Route path="/shopping_cart" component={PagesShoppingCart} />
    </Switch>
  </Router>
  </StrictMode>,
  document.getElementById('pages_shopping_cart')
);
