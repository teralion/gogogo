import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from 'app/pages/Main';
import Delivery from 'app/pages/Delivery';
import Contacts from 'app/pages/Contacts';
import Privacy from 'app/pages/Privacy';
import About from 'app/pages/About';
import Checkout from 'app/pages/Checkout';

function Routes() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={props => <Main {...props} />}
      />
      <Route
        exact
        path="/checkout"
        render={props => <Checkout {...props} />}
      />
      <Route path="/delivery" render={Delivery} />
      <Route path="/contacts" render={Contacts} />
      <Route path="/privacy" render={Privacy} />
      <Route path="/about" render={About} />
    </Switch>
  );
}

export default Routes;
