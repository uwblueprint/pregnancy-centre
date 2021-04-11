import React, { FunctionComponent } from 'react'
import { Row } from 'react-bootstrap'

import Tooltip from '../atoms/Tooltip'


interface Props {
    formItemName: string;
    errorString: string;
    isDisabled: boolean;
    inputComponent: React.ReactNode;
    tooltipText?: string;
}

const FormItem: FunctionComponent<Props> = (props: Props) => {
    const isError = props.errorString.length > 0
    return (
        <div className="form-item">
            <h1>Hi this is pregnancy centre</h1>
            <div className="form-item-top">
                <span>
                    {props.formItemName}
                    { props.tooltipText ? <Tooltip tooltipText={props.tooltipText}/> : null}
                </span>
                <span className="form-item-error-text">Error string</span>
            </div>
            {props.inputComponent}
        </div>
    )
}

export default FormItem
