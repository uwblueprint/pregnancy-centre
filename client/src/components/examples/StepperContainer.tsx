import React, { FunctionComponent, useState } from "react";

import Stepper from "../atoms/Stepper";

const StepperContainer: FunctionComponent<Record<string, never>> = () => {
  const steps = ["Contact Information", "Item Details", "Review and Confirm"];
  return <Stepper steps={steps} selectedStep={0}/>;
};

export default StepperContainer;
