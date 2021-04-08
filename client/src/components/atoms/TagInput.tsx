import React, { FunctionComponent, useState } from "react";
import DeletableTag from "./DeletableTag";
import { TextFieldWithAction } from "./TextFieldWithAction";

interface TagInputProps {
    tagStrings: string[],
    onChange: (value: string) => boolean,
    onSubmit: (value: string) => void,
    onDelete: (id: number) => void,
    isErroneous: boolean
}

const TagInput: FunctionComponent<TagInputProps> = (props: TagInputProps) => {
    return (
        <div className="tag-input">
            <div className="text-field-action-container">            
                <TextFieldWithAction isErroneous={(!props.isErroneous)} onSubmit={(value:string) => props.onSubmit(value)} onChange={(value: string)=> props.onChange(value)} showAction={props.isErroneous} placeholder="Enter a new type" type="text" actionString="Add new type:" iconClassName="bi bi-arrow-return-left"></TextFieldWithAction>
            </div>
            <div className="tag-list">
                {props.tagStrings.map((tag,index) => <div key={index} className="each-tag"><DeletableTag id={index} text={tag} onDelete={(id)=> props.onDelete(id)}/></div>)}
            </div>
               
        </div>
    );
};

export { TagInput };
export type { TagInputProps };