import React, { FunctionComponent } from "react";

import StepNumber from "./StepNumber";

interface StepperProps {
    steps: Array<string>;
    selectedStep: number; // Index starting at 1
}

const Stepper: FunctionComponent<StepperProps> = (props: StepperProps) => {
    return (
        <div className="stepper">
            {props.steps.map((stepName, idx) => {
                const isSelectedStep = props.selectedStep - 1 === idx;
                return (
                    <>
                        <div className={"step " + (isSelectedStep ? "selected-step" : "")}>
                            <StepNumber isSelectedStep={isSelectedStep} stepNumber={idx + 1} />
                            <div className="step-text">
                                <h4>STEP {idx + 1}</h4>
                                <h2>{stepName}</h2>
                            </div>
                        </div>
                        {idx < props.steps.length - 1 && <div className="line" />}
                    </>
                );
            })}
        </div>
    );
};

export default Stepper;
