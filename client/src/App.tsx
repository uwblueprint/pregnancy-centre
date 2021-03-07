import './App.scss';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React from "react";

import ConfirmationModal from "./pages/ConfirmationModal";
import SampleContainer from "./components/examples/SampleContainer";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  return (
    <span>
      <Router>
      <Switch>
        <Route path='/donation-guidelines'><SampleContainer /></Route>
        <Route path='/signup'><SignUpModal /></Route>
        <Route path='/'></Route>
      </Switch>
    </Router>
    </span>
  );
}

export default App;
