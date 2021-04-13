import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AdminHomepage from "./pages/AdminHomepage";
import AuthTestComponent from "./pages/AuthTestComponent";
import DonorHomepage from './pages/DonorHomepage'
import RequestGroupDonorView from "./components/organisms/RequestGroupDonorView";
import ResetPasswordModal from "./pages/ResetPasswordModal"
import SampleContainer from "./components/examples/SampleContainer";
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";


function App(): JSX.Element {
  return (
    <span>
      <Router>
        <Switch>
          <Route path='/donation-guidelines'><SampleContainer /></Route>
          {/* TODO(chamod-gamage): confirm what the routing behaviour will be for user signin sequence */}
          <Route path='/login'><SignInModal /></Route>
          <Route path='/signup' strict component={SignUpModal}></Route>
          <Route path='/verify-email' component={AuthTestComponent}></Route>
          <Route path='/reset-password' strict component={ResetPasswordModal}></Route>
          <Route path='/email-password-reset' strict component={SendResetPasswordEmailModal}></Route>
          <Route path='/admin' component={AdminHomepage}></Route>
          <Route path='/test'>
            <RequestGroupDonorView requestGroupId="603d9b41eb57fc06447b8a23" />
          </Route>
          <Route path='/'><DonorHomepage /></Route>
        </Switch>
      </Router>
    </span >
  );
}

export default App;
