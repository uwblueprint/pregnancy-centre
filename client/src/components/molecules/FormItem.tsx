import React, { FunctionComponent } from 'react'

import Tooltip from '../atoms/Tooltip'

interface Props {
    formItemName: string;
    errorString: string;
    isDisabled: boolean;
    inputComponent: React.ReactNode;
    tooltipText?: string;
    instructions?: string;
    showErrorIcon?: boolean;
}

const FormItem: FunctionComponent<Props> = (props: Props) => {
    const isError = props.errorString.length > 0

    return (
        <div className="form-item">
            <div className="form-item-top">
                <span className={props.isDisabled ? "form-item-disabled" : undefined}>
                    {props.formItemName}
                    {props.tooltipText && <Tooltip tooltipText={props.tooltipText} />}
                </span>
                {isError && <span className="form-item-error-text">{props.errorString}</span>}
            </div>
            {props.instructions &&
                <div className="form-item-instructions">
                    {props.instructions}
                </div>
            }
            <div className="form-item-bottom">
                {props.inputComponent}
                {isError && props.showErrorIcon !== false && <i className="form-item-error-icon bi bi-exclamation-circle alert-icon"></i>}
            </div>
        </div>
    )
}

export default FormItem
