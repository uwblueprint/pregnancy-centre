import React, { FunctionComponent } from "react";

interface StepNumberProps {
    stepNumber: number;
    isSelectedStep: boolean;
}

const StepNumber: FunctionComponent<StepNumberProps> = (props: StepNumberProps) => {
    return (
        <div className={"step-number " + (props.isSelectedStep ? "selected-step" : "")}>
            <h3>
                {props.stepNumber.toLocaleString("en-US", {
                    minimumIntegerDigits: 2
                })}
            </h3>
        </div>
    );
};

export default StepNumber;
