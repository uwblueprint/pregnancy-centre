import React, { FunctionComponent } from "react";

interface StepLabelNumberProps {
  stepNumber: number;
  isSelectedStep: boolean;
}

const StepLabelNumber: FunctionComponent<StepLabelNumberProps> = (
  props: StepLabelNumberProps
) => {
  return (
    <div
      className={
        "step-label-number " + (props.isSelectedStep ? "selected-step" : "")
      }
    >
      <h3>
        {props.stepNumber.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
        })}
      </h3>
    </div>
  );
};

export default StepLabelNumber;
