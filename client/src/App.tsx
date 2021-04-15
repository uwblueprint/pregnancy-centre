import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import firebase from "firebase/app"
import React from "react";

import AdminHomepage from "./pages/AdminHomepage";
import AdminRequestGroupView from "./pages/AdminRequestGroupView"
import AuthAction from "./pages/AuthAction";
import DonorHomepage from './pages/DonorHomepage'
import PrivateRoute from './components/atoms/PrivateRoute'
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null)
  const authenticationPath = '/login'

  firebase.auth().onAuthStateChanged((user) => {
    setCurrentUser(user ? user : null)
  });

  return (
    <span>
      <Router>
        <Switch>
          <Route path={authenticationPath}><SignInModal /></Route>
          <Route path='/signup' component={SignUpModal}></Route>
          <Route path='/auth-action' component={AuthAction}></Route>
          <Route path='/email-password-reset' strict component={SendResetPasswordEmailModal}></Route>
          <PrivateRoute path='/admin' isAuthenticated={currentUser !== null} component={AdminHomepage} authenticationPath={authenticationPath}/>
          <PrivateRoute path='/request-group/:id' isAuthenticated={currentUser !== null} component={AdminRequestGroupView} authenticationPath={authenticationPath}/>
          <Route path='/'><DonorHomepage /></Route>
        </Switch>
      </Router>
    </span >
  );
}

export default App;
