import React, { FunctionComponent } from "react";

import Navbar from "../organisms/Navbar";

const AdminPage: FunctionComponent<Record<string, unknown>> = (
    props: React.PropsWithChildren<Record<string, unknown>>
) => {
    return (
        <div className="admin-page">
            <Navbar
                leftLinks={[
                    { name: "Needs", path: "/needs" },
                    { name: "Forms", path: "/unmatched-forms" },
                    { name: "Edit Main Page", path: "/edit-main-page" }
                ]}
                rightLinks={[{ name: "Log out", path: "/" }]}
            />
            <div className="admin-page-content">{props.children}</div>
        </div>
    );
};

export default AdminPage;
