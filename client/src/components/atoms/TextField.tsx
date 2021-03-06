import React, { FunctionComponent, useRef } from "react";

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
}

const TextField: FunctionComponent<TextFieldProps> = (props: TextFieldProps) => {
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
    return (
        <div className="text-field">
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
                onChange={props.onChange}
                onClick={props.onClick}
                disabled={props.isDisabled}
                autoComplete={props.autocompleteOff ? "off" : "on"}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key == "Enter") {
                        e.preventDefault();
                    }
                }}
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
    );
};

export { TextField };
export type { TextFieldProps };
