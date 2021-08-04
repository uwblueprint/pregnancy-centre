import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AdminMatchedDonationFormsPage from "./pages/AdminMatchedDonationFormsPage";
import AdminRequestGroupsPage from "./pages/AdminRequestGroupsPage";
import AdminRequestGroupView from "./pages/AdminRequestGroupView";
import AdminUnmatchedDonationFormsPage from "./pages/AdminUnmatchedDonationFormsPage";
import AuthAction from "./pages/AuthAction";
import DonationForm from "./pages/DonationForm";
import DonorHomepage from "./pages/DonorHomepage";
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

function App(): JSX.Element {
    return (
        <span>
            <Router>
                <Switch>
                    <Route path="/login">
                        <SignInModal />
                    </Route>
                    <Route path="/signup" strict component={SignUpModal} />
                    <Route path="/auth-action" component={AuthAction} />
                    <Route path="/email-password-reset" strict component={SendResetPasswordEmailModal} />
                    <Route path="/needs" component={AdminRequestGroupsPage} />
                    <Route path="/need/:id" component={AdminRequestGroupView} />
                    <Route path="/unmatched-forms" component={AdminUnmatchedDonationFormsPage} />
                    <Route path="/matched-forms" component={AdminMatchedDonationFormsPage} />
                    <Route path="/donation-form" component={DonationForm} />
                    <Route path="/" component={DonorHomepage} />
                </Switch>
            </Router>
        </span>
    );
}

export default App;
