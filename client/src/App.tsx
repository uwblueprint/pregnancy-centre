import './App.scss';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React from "react";

import RequestGroupDonorView from './components/organisms/RequestGroupDonorView';
import SampleContainer from "./components/examples/SampleContainer";

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path='/donation-guidelines'><SampleContainer /></Route>
        <Route path='/login'><SampleContainer /></Route>
        <Route path='/test'>
          <RequestGroupDonorView requestGroupId="test"/>
        </Route>
        <Route path='/'></Route>
      </Switch>
    </Router>
  );
}

export default App;
