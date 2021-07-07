import React, { FunctionComponent } from "react";

interface Props {
    children: React.ReactNode;
    noBorder?: boolean;
}

const ScrollWindow: FunctionComponent<Props> = (props: Props) => {
    return <div className={"scroll-window" + (props.noBorder ? " scroll-window-no-border" : "")}>{props.children}</div>;
};

export default ScrollWindow;
