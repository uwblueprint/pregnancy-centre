import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AdminHomepage from "./pages/AdminHomepage";
import AdminRequestGroupView from "./pages/AdminRequestGroupView";
import AuthAction from "./pages/AuthAction";
import DonationItemFormContainer from "./components/examples/DonationItemFormContainer";
import DonorHomepage from "./pages/DonorHomepage";
import MatchingRequestTableContainer from "./components/examples/MatchingRequestTableContainer";
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
    return (
        <span>
            <Router>
                <Switch>
                    <Route path="/test">
                        <>
                            <MatchingRequestTableContainer />
                        </>
                    </Route>
                    <Route path="/login">
                        <SignInModal />
                    </Route>
                    <Route path="/signup" strict component={SignUpModal}></Route>
                    <Route path="/auth-action" component={AuthAction}></Route>
                    <Route path="/email-password-reset" strict component={SendResetPasswordEmailModal}></Route>
                    <Route path="/admin" component={AdminHomepage}></Route>
                    <Route path="/request-group/:id">
                        <AdminRequestGroupView />
                    </Route>
                    <Route path="/">
                        <DonorHomepage />
                    </Route>
                </Switch>
            </Router>
        </span>
    );
}

export default App;
