import React, { FunctionComponent } from "react";

interface TextAreaProps {
    className?: string;
    isErroneous: boolean;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    value: string;
    label?: string;
    maxNumChars?: number;
}

const TextArea: FunctionComponent<TextAreaProps> = (props: TextAreaProps) => {
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        if (props.maxNumChars != null && newValue.length > props.maxNumChars) {
            return;
        }
        props.onChange(event);
    };
    
    return (
        <div className="text-area-container">
            <div className="text-area-label">
                <h1>{props.label}</h1>
                {props.maxNumChars != null && (
                    <h1>
                        {props.value.length}/{props.maxNumChars}
                    </h1>
                )}
            </div>
            <textarea
                className={"text-area " + (props.isErroneous ? "error " : "") + props.className}
                onChange={onChange}
                placeholder={props.placeholder}
                value={props.value}
            />
        </div>
    );
};

export default TextArea;
