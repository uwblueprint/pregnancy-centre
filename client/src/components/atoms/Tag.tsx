import React, { FunctionComponent } from "react";

interface TagProps {
  text: string,
}

const Tag: FunctionComponent<TagProps> = (props: TagProps) => {
  return <span className="tag">
    {props.text}
  </span>
};

export { Tag };
export type { TagProps };
