import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import SampleContainer from "./components/examples/SampleContainer";

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/donation-guidelines">
          <SampleContainer />
        </Route>
        <Route path="/login">
          <SampleContainer />
        </Route>
        <Route path="/verify-email">
          <SampleContainer />
        </Route>
        <Route path="/"></Route>
      </Switch>
    </Router>
  );
}

export default App;
