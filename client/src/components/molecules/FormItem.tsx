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
            <h1>pregnancy centre</h1>
            <div className="form-item-top">
                <span className={props.isDisabled ? "form-item-disabled" : undefined}>
                    {props.formItemName}
                    { props.tooltipText ? <Tooltip tooltipText={props.tooltipText}/> : null}
                </span>
                {isError && <span className="form-item-error-text">{props.errorString}</span>}
            </div>
            {props.inputComponent}
            {isError && <i className="form-item-error-icon bi bi-exclamation-circle alert-icon"></i>}
        </div>
    )
}

export default FormItem
