import React, { FunctionComponent } from "react";

interface Props {
    text: string,
    small?: boolean,
}

const Tag: FunctionComponent<Props> = (props: Props) => {
  return <span className={"tag" + (props.small ? " small" : "")}>
      {props.text}
  </span>
};

export default Tag;
