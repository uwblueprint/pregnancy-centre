import React, { FunctionComponent } from "react";

import Tooltip from "../atoms/Tooltip";

interface Props {
    formItemName: string;
    errorString: string;
    isDisabled: boolean;
    inputComponent: React.ReactNode;
    tooltipText?: string;
    instructions?: string;
    showErrorIcon: boolean;
    className?: string;
    isErroneous?: boolean;
    labelBoostrapIcon?: string;
    showLabel?: boolean;
    showErrorUnderInput?: boolean;
}

const FormItem: FunctionComponent<Props> = (props: Props) => {
    const isError = (props.errorString ?? "").length > 0 || props.isErroneous;

    return (
        <div className={"form-item " + props.className}>
            <div className="form-item-top">
                <span className={props.isDisabled ? "form-item-disabled" : undefined}>
                    {props.labelBoostrapIcon && <i className={props.labelBoostrapIcon + " label-icon"} />}
                    {props.showLabel !== false && props.formItemName}
                    {props.tooltipText && <Tooltip className="form-item-tooltip" tooltipText={props.tooltipText} />}
                </span>
                {isError && props.showErrorUnderInput !== true && (
                    <span className="form-item-error-text">{props.errorString}</span>
                )}
            </div>
            {props.instructions && <div className="form-item-instructions">{props.instructions}</div>}
            <div className="form-item-bottom">
                {props.inputComponent}
                {isError && props.showErrorIcon && (
                    <i className="form-item-error-icon bi bi-exclamation-circle alert-icon"></i>
                )}
                {isError && props.showErrorUnderInput && (
                    <span className="form-item-error-text">{props.errorString}</span>
                )}
            </div>
        </div>
    );
};

export default FormItem;
