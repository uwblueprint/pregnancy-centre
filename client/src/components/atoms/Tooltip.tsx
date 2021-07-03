import { OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { FunctionComponent } from "react";

interface Props {
    tooltipText: string;
    className?: string;
}

const CustomTooltip: FunctionComponent<Props> = (props: Props) => {
    const renderTooltip = (p: Record<string, unknown>) => {
        return (
            <Tooltip id="button-tooltip" className={props.className ?? ""} {...p}>
                {props.tooltipText}
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger placement="right-end" overlay={renderTooltip} transition={false}>
            {({ ref, ...triggerHandler }) => (
                <span className="tooltip-trigger" {...triggerHandler} ref={ref}>
                    <i className="bi bi-question-circle"></i>
                </span>
            )}
        </OverlayTrigger>
    );
};

export default CustomTooltip;
