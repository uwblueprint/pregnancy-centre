import React, { FunctionComponent, useState } from "react";
import { TagInput } from "../atoms/TagInput";

interface TagInputContainerProps {
    name:string
}

const TagInputContainer: FunctionComponent<TagInputContainerProps> = (props: TagInputContainerProps) => {
    const [ tagStringsList, setTagStringsList ] = useState<string[]>(["random"]); 
    const [ validInput, setValidInput ] = useState(true);

    const onChange = (value: string) => {
        if (!isValidInput(value)){
            setValidInput(false); 
        } else{
            setValidInput(true);
        }
    }
    const onSubmit = (value: string) => {
        setTagStringsList([...tagStringsList, value]);
    }
    const onDelete = (id:number) => {
        setTagStringsList(tagStringsList.filter((_,i) => i !== id));
    }
    const isValidInput = (value:string) => {
        // could be replaced with logic such as if value exists in list
        if (value.length > 10 && value.length < 15){
            return false; 
        } else{
            return true;
        }
    };

    return (
        <TagInput tagStrings={tagStringsList} onSubmit={(value)=> onSubmit(value)} onChange={(value)=>onChange(value)} onDelete={(id)=>onDelete(id)} validateInput={validInput}></TagInput>
    );
};

export { TagInputContainer };
export type { TagInputContainerProps };