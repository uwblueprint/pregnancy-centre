import React, { FunctionComponent } from "react";
import Tag from "./Tag";

interface Props {
    id: number,
    text: string,
    onDelete: (id: number) => void
}

const DeletableTag: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="deletable-tag">
            <span className="tag">
                <i className="bi bi-x" style={{marginRight:"5px"}} onClick={()=> props.onDelete(props.id)}></i>
                {props.text}
            </span>
        </div>
        
    );
  
};

export default DeletableTag;