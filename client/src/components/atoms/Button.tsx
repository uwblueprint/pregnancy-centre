import React, { FunctionComponent } from "react";

import {CopyToClipboard} from 'react-copy-to-clipboard';

interface ButtonProps {
    text: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    copyText: string
}

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return <React.Fragment>
      <CopyToClipboard text={props.copyText}>
        <button className="button" onClick={props.onClick}>
            {props.text}
        </button>
      </CopyToClipboard>
  </React.Fragment>
};

export { Button };    
export type { ButtonProps };
