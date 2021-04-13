import React, { FunctionComponent } from "react";

interface Props {
  text: string,
}

const Tag: FunctionComponent<Props> = (props: Props) => {
  return <span className="tag">
    {props.text}
  </span>
};

export default Tag;
