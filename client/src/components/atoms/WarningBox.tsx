import React, { FunctionComponent } from "react";

interface Props {
    text: string;
    showWarning: boolean;
}

const WarningBox: FunctionComponent<Props> = (props: Props) => {
    const { showWarning } = props;
    return (
        <div className={showWarning ? "warning-box" : "warning-box-hidden"}>
            <p className="warning-box-text">{props.text}</p>
        </div>
    );
};

export default WarningBox;
