import React, { FunctionComponent, useState } from "react";

import RequestForm from "../organisms/RequestForm";

const EditRequestGroupFormContainer: FunctionComponent<Record<string, never>> = () => {
    const [show, setShow] = useState(true);

    return (
        <>
            {show && (
                <RequestForm
                    onSubmitComplete={() => {
                        window.location.reload();
                    }}
                    handleClose={() => setShow(false)}
                    operation="edit"
                    requestId="6077592acca67d9812f94df5"
                />
            )}
        </>
    );
};

export default EditRequestGroupFormContainer;
