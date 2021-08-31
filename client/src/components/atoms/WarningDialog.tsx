import React, { FunctionComponent } from "react";

export interface Props {
    dialogTitle: string;
    dialogText: string;
    onClose: () => void;
}

const WarningDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="warning-dialog">
            <p className="warning-display-text">{props.dialogTitle}</p>
            <p className="warning-prompt">{props.dialogText}</p>
            <div className="warning-dialog-buttons">
                <button className="warning-leave-button" onClick={props.onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default WarningDialog;
