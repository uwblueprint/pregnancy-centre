import React, { FunctionComponent, useState } from "react";
import { TagInput } from "../atoms/TagInput";

interface TagInputContainerProps {
    name:string
}

const TagInputContainer: FunctionComponent<TagInputContainerProps> = (props: TagInputContainerProps) => {
    const [ tagStringsList, setTagStringsList ] = useState<string[]>(["random"]); 

    const onChange = (value: string) => {
        setTagStringsList([...tagStringsList, value]);
    }
    const onDelete = (id:number) => {
        setTagStringsList(tagStringsList.filter((_,i) => i !== id));
    }
    return (
        <TagInput tagStrings={tagStringsList} onChange={(value)=>onChange(value)} onDelete={(id)=>onDelete(id)} validateInput={true}></TagInput>
    );
};

export { TagInputContainer };
export type { TagInputContainerProps };