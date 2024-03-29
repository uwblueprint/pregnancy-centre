import React, { FunctionComponent } from "react";

import StepNumber from "./StepNumber";

interface StepperProps {
    steps: Array<string>;
    selectedStep: number; // Index starting at 0
}

const Stepper: FunctionComponent<StepperProps> = (props: StepperProps) => {
    return (
        <div className="stepper">
            {props.steps.map((stepName, idx) => {
                const isSelectedStep = props.selectedStep === idx;
                return (
                    <>
                        <div className={"step " + (isSelectedStep ? "selected-step" : "")} key={idx}>
                            <StepNumber isSelectedStep={isSelectedStep} stepNumber={idx + 1} />
                            <div className="step-text">
                                <h4>STEP {idx + 1}</h4>
                                <h2>{stepName}</h2>
                            </div>
                        </div>
                        {idx < props.steps.length - 1 && <div className="line" key={-1 * idx} />}
                    </>
                );
            })}
        </div>
    );
};

export default Stepper;
