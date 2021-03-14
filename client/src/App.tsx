import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AuthTestComponent from './pages/AuthTestComponent';
import ConfirmationModal from "./pages/ConfirmationModal";
import EmailConfirmedModal from './pages/EmailConfirmedModal';
import RequestGroupDonorView from './components/organisms/RequestGroupDonorView';
import SampleContainer from "./components/examples/SampleContainer";
import SignUpModal from './pages/SignUpModal';

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path='/donation-guidelines'><SampleContainer /></Route>
        <Route path='/login'><SampleContainer /></Route>
        {/* TODO(jlight99): delete /confirmation endpoint after logic for triggering the confirmation modal upon signup has been added */}
        <Route path='/confirmation' component={() => <ConfirmationModal email="anna@pregnancycentre.ca"/>}></Route>
        <Route path='/signup' strict component={SignUpModal}></Route>
        {/* TODO(jlight99): delete /email-confirmed endpoint after logic for triggering the email confirmed modal has been added */}
        <Route path='/email-confirmed' strict component={EmailConfirmedModal}></Route>
        <Route path='/verify-email' component={AuthTestComponent}></Route>
        <Route path='/test'>
          <RequestGroupDonorView requestGroupId="603d9b41eb57fc06447b8a23"/>
        </Route>
        <Route path='/'></Route>
      </Switch>
    </Router>
  );
}

export default App;
