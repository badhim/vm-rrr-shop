import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PagesIndex from '../components/PagesIndex';

ReactDOM.render(
  <StrictMode>
  <Router>
    <Switch>
      <Route exact path="/" component={PagesIndex} />
    </Switch>
  </Router>
  </StrictMode>,
  document.getElementById('pages_index')
);
