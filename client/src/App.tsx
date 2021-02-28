import './App.scss';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React from "react";

import ConfirmationModal from "./pages/ConfirmationModal";
import SampleContainer from "./components/examples/SampleContainer";
import SignUp from './pages/SignUp';
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  return (
    <span>
      <Router>
      <Switch>
        <Route path='/test' component={SampleContainer}></Route>
        <Route path='/signup' strict component={SignUpModal}></Route>
        <Route path='/signuptest' strict component={SignUp}></Route>
        <Route path='/confirmation' component={ConfirmationModal}></Route>
      </Switch>
    </Router>
    </span>
  );
}

export default App;
