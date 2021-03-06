import React, { FunctionComponent, useState } from "react";
import { TagInput } from "../atoms/TagInput";

interface TagInputContainerProps {
    name: string;
}

const TagInputContainer: FunctionComponent<TagInputContainerProps> = () => {
    const [tagStringsList, setTagStringsList] = useState<string[]>(["Diapers"]);
    const [validInput, setValidInput] = useState(true);

    const onChange = (value: string) => {
        if (!isValidInput(value)) {
            setValidInput(false);
            return false;
        } else {
            setValidInput(true);
            return true;
        }
    };
    const onSubmit = (value: string) => {
        const input: string = value.trim();
        setTagStringsList([...tagStringsList, input]);
    };
    const onDelete = (value: string) => {
        setTagStringsList(tagStringsList.filter((tagString) => tagString !== value));
    };
    const isValidInput = (value: string) => {
        // could be replaced with any validation logic
        const input: string = value.trim();
        if (tagStringsList.includes(input)) {
            return false;
        }
        return true;
    };

    return (
        <div style={{ marginLeft: "20px", marginTop: "20px" }}>
            <TagInput
                tagStrings={tagStringsList}
                onSubmit={(value) => onSubmit(value)}
                onChange={(value) => onChange(value)}
                onDelete={(id) => onDelete(id)}
                isErroneous={validInput}
                placeholder="this is a placeholder"
                actionString="action:"
            ></TagInput>
        </div>
    );
};

export { TagInputContainer };
export type { TagInputContainerProps };
