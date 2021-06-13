import React, { FunctionComponent } from "react";

interface Props {
  children: React.ReactNode
}

const CardWithShadow: FunctionComponent<Props> = (props: Props) => {
  return <div className="card-with-shadow">
    {props.children}
  </div>
};

export default CardWithShadow;
