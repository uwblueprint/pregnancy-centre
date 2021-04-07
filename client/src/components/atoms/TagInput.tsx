import React, { FunctionComponent, useState } from "react";
import Tag from "./Tag";
import { TextField } from "./TextField";
import { TextFieldWithAction } from "./TextFieldWithAction";

interface TagInputProps {
    tagStrings: string[],
    isErroneous: boolean,
    onChange: (value: string) => any,
    validateInput: boolean
}

const TagInput: FunctionComponent<TagInputProps> = (props: TagInputProps) => {
    return (
        <div className="tag-input">
            <div className="text-field-action-container">            
                <TextFieldWithAction isErroneous={props.isErroneous} onChange={(value: string)=> props.onChange(value)} showAction={props.validateInput} placeholder="Enter a new type" type="text" actionString="Add new type:" iconClassName="bi bi-arrow-return-left"></TextFieldWithAction>
            </div>
            {props.validateInput && 
                <div className="tag-list">
                    {props.tagStrings.map((tag,index) => <div key={index} className="each-tag"><Tag text={tag}/></div>)}
                </div>
            }    
        </div>
    );
};

export { TagInput };
export type { TagInputProps };