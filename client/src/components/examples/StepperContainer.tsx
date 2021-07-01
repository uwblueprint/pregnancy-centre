import React, { FunctionComponent, useState } from "react";

import Stepper from "../atoms/Stepper";

const StepperContainer: FunctionComponent<Record<string, never>> = () => {
  const steps = ["Contact Information", "Item Details", "Review and Confirm"];
  return (
    <div style={{ marginTop: "30px", marginLeft: "30px" }}>
      <Stepper steps={steps} selectedStep={0} />
    </div>
  );
};

export default StepperContainer;
