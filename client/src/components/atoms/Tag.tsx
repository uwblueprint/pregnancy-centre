import React, { FunctionComponent } from "react";

interface Props {
    className?: string;
    text: string;
}

const Tag: FunctionComponent<Props> = (props: Props) => {
    return <span className={"tag " + (props.className ?? "")}>{props.text}</span>;
};

export default Tag;
