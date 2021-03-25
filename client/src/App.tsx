import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AuthTestComponent from "./pages/AuthTestComponent";
import ConfirmationModal from "./pages/ConfirmationModal";
import DonorHomepage from './pages/DonorHomepage'
import PasswordResetEmailSentModal from "./pages/PasswordResetEmailSentModal";
<<<<<<< HEAD
import RequestGroupDonorView from './components/organisms/RequestGroupDonorView';
import RequestTypeDropdownList from "./components/organisms/RequestTypeDropdownList";
=======
import RequestGroupDonorView from "./components/organisms/RequestGroupDonorView";
>>>>>>> dcd44615c8ee1e70eb7e30612e12c84c1f42afba
import SampleContainer from "./components/examples/SampleContainer";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  return (
    <span>
      <Router>
        <Switch>
          <Route path='/signup' strict component={SignUpModal}></Route>
          <Route path='/donation-guidelines'><SampleContainer /></Route>
          {/* TODO(chamod-gamage): confirm what the routing behaviour will be for user signin sequence */}
          <Route path='/login'><SignInModal /></Route>
          {/* TODO(jlight99): delete /confirmation endpoint after logic for triggering the confirmation modal upon signup has been added */}
          <Route path='/confirmation' component={() => <ConfirmationModal email="anna@pregnancycentre.ca" />}></Route>
          <Route path='/signup' strict component={SignUpModal}></Route>
          <Route path='/verify-email' component={AuthTestComponent}></Route>
          <Route path='/password-reset-email-sent' strict component={PasswordResetEmailSentModal}></Route>
          <Route path='/test'>
            <RequestGroupDonorView requestGroupId="603d9b41eb57fc06447b8a23" />
          </Route>
          <Route path='/'><DonorHomepage /></Route>
          <Route path='/requests'><RequestTypeDropdownList requestTypes={["250 ML (20)", "150 ML (20)"]}></RequestTypeDropdownList></Route>
        </Switch>
      </Router>
    </span>
  );
}

export default App;
