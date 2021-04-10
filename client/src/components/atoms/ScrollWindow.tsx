import React, { FunctionComponent } from "react";

interface Props {
  children: React.ReactNode
}

const ScrollWindow: FunctionComponent<Props> = (props: Props) => {
  return <div className="scroll-window">
    {props.children}
  </div>
};

export default ScrollWindow;
