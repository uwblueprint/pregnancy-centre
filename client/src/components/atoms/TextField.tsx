import React, { FunctionComponent, useRef, useState } from "react";

interface TextFieldProps {
    input: string | number;
    isDisabled: boolean; // the entire text field is disabled (can't enter input + everything greyed out)
    isDisabledUI?: boolean; // grey out the icon and placeholder, but still enable editing input
    isErroneous: boolean;
    // by default, when there is an error, the border is highlighted in red but the text is still black
    // when showRedErrorText is true, when there is an error the text will also be highlighted in red
    showRedErrorText?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
    name: string;
    placeholder: string;
    type: "text" | "password" | "number";
    iconClassName?: string;
    onIconClick?: React.MouseEventHandler<HTMLElement>;
    autocompleteOff?: boolean;
    focusOnIconClick?: boolean;
    readOnly?: boolean;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    maxNumChars?: number;
}

const TextField: FunctionComponent<TextFieldProps> = (props: TextFieldProps) => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const onIconClick = (event: React.MouseEvent<HTMLElement>) => {
        if (props.isDisabled) {
            return;
        }
        if (props.onIconClick) {
            props.onIconClick(event);
        }
        if (props.focusOnIconClick && textFieldRef && textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
        if (props.onKeyDown) {
            props.onKeyDown(event);
        }
    };
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInput = event.target.value;
        if (props.maxNumChars != null && typeof newInput === "string" && newInput.length > props.maxNumChars) {
            return;
        }
        props.onChange(event);
    };
    return (
        <div className="text-field">
            <div className="input-container">
                <input
                    type={props.type}
                    name={props.name}
                    className={
                        "text-field-input" +
                        (props.isErroneous ? " error" : "") +
                        (props.isDisabledUI ? " disabled" : "") +
                        (props.showRedErrorText ? " red-error-text" : "")
                    }
                    placeholder={props.placeholder}
                    value={props.input}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={onChange}
                    onClick={props.onClick}
                    onFocus={() => setIsInputFocused(true)}
                    disabled={props.isDisabled}
                    autoComplete={props.autocompleteOff ? "off" : "on"}
                    onKeyDown={onKeyDown}
                    readOnly={props.readOnly}
                    ref={textFieldRef}
                />
                {props.iconClassName && (
                    <i
                        onClick={onIconClick}
                        className={
                            props.iconClassName +
                            (props.isErroneous ? " error" : "") +
                            (props.isDisabled || props.isDisabledUI ? " disabled" : "")
                        }
                    />
                )}
            </div>
            {isInputFocused && props.maxNumChars != null && typeof props.input === "string" && (
                <div className="char-count-container">
                    <p>
                        {props.input.length}/{props.maxNumChars}
                    </p>
                </div>
            )}
        </div>
    );
};

export { TextField };
export type { TextFieldProps };
