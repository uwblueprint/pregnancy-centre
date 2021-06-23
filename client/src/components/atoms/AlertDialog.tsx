import React, { FunctionComponent } from 'react'

export interface Props {
    dialogText: string
    onExit: () => void
    onStay: () => void
}

const AlertDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="alert-dialog">
            <p className="alert-display-text">{props.dialogText}</p>
            <p className="alert-prompt">Are you sure you want to leave?</p>
            <div className="alert-dialog-buttons">
                <button className="alert-stay-button" onClick={props.onStay}>Keep Editing</button>
                <button className="alert-leave-button" onClick={props.onExit}>Leave</button>
            </div>
        </div>
    )
}

export default AlertDialog
