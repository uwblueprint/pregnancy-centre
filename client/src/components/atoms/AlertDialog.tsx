import React, { FunctionComponent } from 'react'

interface Props {
    dialogText: string
    onExit: () => void
    onStay: () => void
}

const AlertDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <h1>{props.dialogText}</h1>
    )
}

export default AlertDialog
