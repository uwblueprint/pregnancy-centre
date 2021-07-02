import React, { FunctionComponent } from "react";

interface TextAreaProps {
    className?: string;
    isErroneous: boolean;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    value: string;
}

const TextArea: FunctionComponent<TextAreaProps> = (props: TextAreaProps) => {
    return (
        <textarea
            className={"text-area " + (props.isErroneous ? "error " : "") + props.className}
            onChange={props.onChange}
            placeholder={props.placeholder}
            value={props.value}
        />
    );
};

export default TextArea;
