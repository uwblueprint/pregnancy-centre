import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";

import Navbar from "../organisms/Navbar";

const AdminPage: FunctionComponent<Record<string, unknown>> = (
    props: React.PropsWithChildren<Record<string, unknown>>
) => {
    const history = useHistory();
    const [unseenDonationFormsExist, setUnseenDonationFormsExist] = useState(false);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user == null) {
            history.push("/login");
        }
    });

    const unseenDonationFormsExistQuery = gql`
        query unseenDonationFormsExist {
            unseenDonationFormsExist
        }
    `;
    useQuery(unseenDonationFormsExistQuery, {
        onCompleted: (data: { unseenDonationFormsExist: boolean }) => {
            setUnseenDonationFormsExist(data.unseenDonationFormsExist);
        }
    });

    const onLogout = () => {
        const auth = firebase.auth();
        auth.signOut();
    };

    return (
        <div className="admin-page">
            <Navbar
                leftLinks={[
                    { name: "Needs", path: "/needs" },
                    { name: "Forms", path: "/unmatched-forms", isEmphasized: unseenDonationFormsExist },
                    { name: "Edit Main Page", path: "/edit-main-page" }
                ]}
                rightLinks={[{ name: "Log out", path: "/", callback: onLogout }]}
            />
            <div className="admin-page-content">{props.children}</div>
        </div>
    );
};

export default AdminPage;
