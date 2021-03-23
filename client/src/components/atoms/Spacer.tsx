import React, { FunctionComponent } from "react";

interface Props {
    height: number
}

const Spacer: FunctionComponent<Props> = (props: Props) => {
  return <div style = {{height: props.height}}/>
};

export default Spacer;