import React, { FunctionComponent, useState } from "react";
import Tag from "./Tag";
import { TextField } from "./TextField";
import { TextFieldWithAction } from "./TextFieldWithAction";

interface TagInputProps {
    tagStrings: string[],
    isErroneous: boolean,
    onChange: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    validateInput: boolean
}

const TagInput: FunctionComponent<TagInputProps> = (props: TagInputProps) => {
    return (
        <div className="tag-input">
            <TextFieldWithAction isErroneous={props.isErroneous} onChange={props.onChange} showAction={props.validateInput} placeholder="Enter a new type" type="text" actionString="Add new type:" iconClassName="arrow-return-left"></TextFieldWithAction>
            {props.validateInput && 
                <div className="tag-list">
                    {props.tagStrings.map((tag,index) => <Tag key={index} text={tag}></Tag>)}
                </div>
            }    
        </div>
    );
};

export { TagInput };
export type { TagInputProps };