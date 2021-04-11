import React, { FunctionComponent } from "react";

interface TagProps {
    text: string,
    small?: boolean,
}

const Tag: FunctionComponent<TagProps> = (props: TagProps) => {
  return <span className={"tag" + (props.small ? " small" : "")}>
      {props.text}
  </span>
};

export { Tag };
export type { TagProps };
