import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AdminHomepage from "./pages/AdminHomepage";
import AdminRequestGroupView from "./pages/AdminRequestGroupView"
import AuthTestComponent from "./pages/AuthTestComponent";
import DonorHomepage from './pages/DonorHomepage'
import ResetPasswordModal from "./pages/ResetPasswordModal"
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  return (
    <span>
      <Router>
        <Switch>
          <Route path='/login'><SignInModal /></Route>
          <Route path='/signup' strict component={SignUpModal}></Route>
          <Route path='/verify-email' component={AuthTestComponent}></Route>
          <Route path='/reset-password' strict component={ResetPasswordModal}></Route>
          <Route path='/email-password-reset' strict component={SendResetPasswordEmailModal}></Route>
          <Route path='/admin' component={AdminHomepage}></Route>
          <Route path='/request-group/:id'><AdminRequestGroupView /></Route>
          <Route path='/'><DonorHomepage /></Route>
        </Switch>
      </Router>
    </span >
  );
}

export default App;
