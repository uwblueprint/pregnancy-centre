import React, { FunctionComponent, useState } from "react";

import UploadImageModal from "../organisms/UploadImageModal";

const UploadImageModalContainer: FunctionComponent<Record<string, never>> = () => {
    const [show, setShow] = useState(true);

    return (
        <>
            {show && (
                <UploadImageModal
                    handleClose={() => setShow(false)}
                    onSubmit={(imageURL) => {
                        console.log(imageURL);
                        setShow(false);
                    }}
                />
            )}
        </>
    );
};

export default UploadImageModalContainer;
