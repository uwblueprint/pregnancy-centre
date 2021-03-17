import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import ConfirmationModal from "./pages/ConfirmationModal";
import DonorRequestGroupBrowser from './components/organisms/DonorRequestGroupBrowser'
import EmailConfirmedModal from './pages/EmailConfirmedModal';
import RequestGroupDonorView from './components/organisms/RequestGroupDonorView';
import SampleContainer from "./components/examples/SampleContainer";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  return (
    <span>
      <Router>
      <Switch>
        
        <Route path='/signup' strict component={SignUpModal}></Route>
        <Route path='/confirmation' component={() => <ConfirmationModal email="anna@pregnancycentre.ca"/>}></Route>
        <Route path='/donation-guidelines'><SampleContainer /></Route>
        <Route path='/login'><SampleContainer /></Route>
        {/* TODO(jlight99): delete /confirmation endpoint after logic for triggering the confirmation modal upon signup has been added */}
        <Route path='/confirmation' component={() => <ConfirmationModal email="anna@pregnancycentre.ca"/>}></Route>
        <Route path='/signup' strict component={SignUpModal}></Route>
        {/* TODO(jlight99): delete /email-confirmed endpoint after logic for triggering the email confirmed modal has been added */}
        <Route path='/email-confirmed' strict component={EmailConfirmedModal}></Route>
        <Route path='/password-reset-email-sent' strict component={PasswordResetEmailSentModal}></Route>
        <Route path='/test'>
          <RequestGroupDonorView requestGroupId="603d9b41eb57fc06447b8a23"/>
        </Route>
        <Route path='/'><DonorRequestGroupBrowser /></Route>
      </Switch>
    </Router>
    </span>
  );
}

export default App;
