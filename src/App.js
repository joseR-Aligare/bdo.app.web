import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


class App extends Component  {
  render() {
  
  return (
    <Router>
      <Switch>
        <Route>
          <h1>Marine Foods!v1</h1>
        </Route>
      </Switch>
    </Router>

  );
}
}

export default App;