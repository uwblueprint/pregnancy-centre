import React, { FunctionComponent } from "react";

interface TextAreaProps {
    className?: string;
    isErroneous: boolean;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    value: string;
    label?: string;
    maxNumChars?: number;
    minNumChars?: number;
}

const TextArea: FunctionComponent<TextAreaProps> = (props: TextAreaProps) => {
    const [isErroneous, setIsErroneous] = React.useState(props.isErroneous);
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        if (props.maxNumChars != null && newValue.length > props.maxNumChars) {
            setIsErroneous(true);
            return;
        } else if (props.minNumChars != null && newValue.length < props.minNumChars) {
            setIsErroneous(true);
        } else {
            setIsErroneous(false);
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
                className={"text-area " + (isErroneous ? "error " : "") + props.className}
                onChange={onChange}
                placeholder={props.placeholder}
                value={props.value}
            />
        </div>
    );
};

export default TextArea;
