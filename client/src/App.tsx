import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

import AdminDonationMatchingPage from "./pages/AdminDonationMatchingPage";
import AdminEditTestimonialsPage from "./pages/AdminEditTestimonialsPage";
import AdminMatchedDonationFormsPage from "./pages/AdminMatchedDonationFormsPage";
import AdminMatchedFormDetailsPage from "./pages/AdminMatchedFormDetailsPage";
import AdminRequestGroupsPage from "./pages/AdminRequestGroupsPage";
import AdminRequestGroupView from "./pages/AdminRequestGroupView";
import AdminUnmatchedDonationFormsPage from "./pages/AdminUnmatchedDonationFormsPage";
import AuthAction from "./pages/AuthAction";
import DonationForm from "./pages/DonationForm";
import DonorHomepage from "./pages/DonorHomepage";
import SendResetPasswordEmailModal from "./pages/SendResetPasswordEmailModal";
import SignInModal from "./pages/SignInModal";
import SignUpModal from "./pages/SignUpModal";

import TextAreaContainer from "./components/examples/TextAreaContainer";
import UploadImageModalContainer from "./components/examples/UploadImageModalContainer";

function App(): JSX.Element {
    return (
        <span>
            <Router>
                <Switch>
                    <Route path="/matching/donation-form/:id">
                        <AdminDonationMatchingPage />
                    </Route>
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
                    <Route path="/matched-form/:id" component={AdminMatchedFormDetailsPage} />
                    <Route path="/donation-form" component={DonationForm} />
                    <Route path="/edit-main-page" component={AdminEditTestimonialsPage} />
                    <Route path="/upload-photo" component={UploadImageModalContainer} />
                    <Route path="/text-area" component={TextAreaContainer} />
                    <Route path="/" component={DonorHomepage} />
                </Switch>
            </Router>
        </span>
    );
}

export default App;
