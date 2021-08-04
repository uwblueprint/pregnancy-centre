import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import Row from "react-bootstrap/Row";

import AdminDonationMatchingBrowser from "../components/organisms/AdminDonationMatchingBrowser";
import AdminPage from "../components/layouts/AdminPage";
import AlertDialog from "../components/atoms/AlertDialog";
import { useHistory } from "react-router-dom";

const AdminDonationMatchingPage: FunctionComponent = () => {
    const history = useHistory();

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [targetLocation, setTargetLocation] = useState("");
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const unblockRef = useRef<any>();

    useEffect(() => {
        const browserAlertCallback = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        if (hasUnsavedChanges) {
            // block page transition
            unblockRef.current = history.block((location: any): false => {
                setTargetLocation(location);
                handleShowAlertDialog();
                return false;
            });
        } else if (unblockRef.current) {
            unblockRef.current();
            unblockRef.current = undefined;
        }

        // block refresh and links
        window.addEventListener("beforeunload", browserAlertCallback);
        return () => {
            window.removeEventListener("beforeunload", browserAlertCallback);
            if (unblockRef.current) {
                unblockRef.current();
            }
        };
    }, [hasUnsavedChanges]);

    const handleShowAlertDialog = () => {
        setShowAlertDialog(true);
    };

    const onExit = () => {
        // unblock and exit page
        if (unblockRef.current) {
            unblockRef.current();
        }
        history.push(targetLocation);
    };

    const onStay = () => {
        setShowAlertDialog(false);
    };

    return (
        <div className="admin-donation-matching-page">
            {showAlertDialog && (
                <AlertDialog dialogText="This matching has not been saved yet." onExit={onExit} onStay={onStay} />
            )}
            <AdminPage>
                <Row className="admin-donation-matching-page-browser">
                    <AdminDonationMatchingBrowser setHasUnsavedChanges={setHasUnsavedChanges} />
                </Row>
            </AdminPage>
        </div>
    );
};

export default AdminDonationMatchingPage;
