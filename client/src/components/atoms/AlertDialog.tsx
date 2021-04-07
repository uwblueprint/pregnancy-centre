import React, { FunctionComponent } from 'react'

interface Props {
    dialogText: string
    onExit: () => void
    onStay: () => void
}

const AlertDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="alert-box">
            <p className="alert-display-text">{props.dialogText}</p>
            <p className="alert-prompt">Are you sure you want to leave?</p>
            <button className="alert-stay-button" onClick={props.onExit}>Keep Editing</button>
            <button className="alert-leave-button" onClick={props.onStay}>Leave</button>
        </div>
    )
}

export default AlertDialog
