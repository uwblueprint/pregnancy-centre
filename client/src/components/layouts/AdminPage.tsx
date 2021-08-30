import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";

import Navbar from "../organisms/Navbar";

const AdminPage: FunctionComponent<Record<string, unknown>> = (
    props: React.PropsWithChildren<Record<string, unknown>>
) => {
    const [unseenDonationFormsExist, setUnseenDonationFormsExist] = useState(false);
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
    return (
        <div className="admin-page">
            <Navbar
                leftLinks={[
                    { name: "Needs", path: "/needs" },
                    { name: "Forms", path: "/unmatched-forms", isEmphasized: unseenDonationFormsExist }
                ]}
                rightLinks={[{ name: "Log out", path: "/" }]}
            />
            <div className="admin-page-content">{props.children}</div>
        </div>
    );
};

export default AdminPage;
