import React, { FunctionComponent, useState } from "react";

import DonationEditFormModal from "../organisms/DonationEditFormModal";
import DonationForm from "../../data/types/donationForm";

const DonationEditFormModalContainer: FunctionComponent<Record<string, never>> = () => {
    const [show, setShow] = useState(true);
    const donationForm: DonationForm = {
        adminNotes: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        name: "Antique robe",
        quantity: 5
    };

    return (
        <>
            {show && (
                <DonationEditFormModal
                    donationForm={donationForm}
                    handleClose={() => setShow(false)}
                    onSubmitComplete={() => setShow(false)}
                />
            )}
        </>
    );
};

export default DonationEditFormModalContainer;
