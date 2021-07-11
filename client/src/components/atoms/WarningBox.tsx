import React, { FunctionComponent } from "react";

interface Props {
    text: string;
}

const WarningBox: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="warning-box">
            <p className="warning-box-text">{props.text}</p>
        </div>
    );
};

export default WarningBox;
