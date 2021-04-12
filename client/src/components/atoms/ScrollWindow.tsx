import 'simplebar';
import 'simplebar/dist/simplebar.css';
import React, { FunctionComponent } from "react";
// import SimpleBar from 'simplebar-react';

// import 'simplebar/dist/simplebar.min.css';

interface Props {
  children: React.ReactNode
}

const ScrollWindow: FunctionComponent<Props> = (props: Props) => {
  return <div className="scroll-window" data-simplebar>
      {props.children}
  </div>
};

export default ScrollWindow;
