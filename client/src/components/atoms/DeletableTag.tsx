import React, { FunctionComponent } from "react";

interface Props {
    text: string;
    onDelete: (text: string) => void;
}

const DeletableTag: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="deletable-tag">
            <span className="tag">
                <i className="bi bi-x" style={{ marginRight: "5px" }} onClick={() => props.onDelete(props.text)}></i>
                {props.text}
            </span>
        </div>
    );
};

export default DeletableTag;
