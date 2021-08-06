import React, { FunctionComponent } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

interface ButtonProps {
    className?: string;
    disabled?: boolean;
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    copyText: string;
    type?: "button" | "submit" | "reset" | undefined;
}

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
    return (
        <React.Fragment>
            <CopyToClipboard text={props.copyText}>
                <button
                    className={"button " + props.className}
                    disabled={props.disabled}
                    onClick={props.onClick}
                    type={props.type}
                >
                    {props.text}
                </button>
            </CopyToClipboard>
        </React.Fragment>
    );
};

export { Button };
export type { ButtonProps };
