import React, { FunctionComponent } from "react";

interface TagProps {
  text: string,
//   dropdownItem?: boolean,
}

const Tag: FunctionComponent<TagProps> = (props: TagProps) => {
//   return <span className={"tag" + (props.dropdownItem ? " dropdownItem" : "")}>
  return <span className="tag">
    {props.text}
  </span>
};

export { Tag };
export type { TagProps };
