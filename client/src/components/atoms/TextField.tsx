import React, { FunctionComponent } from "react";

interface TextFieldProps {
  input: string,
  isDisabled: boolean, // the entire text field is disabled (can't enter input + icon greyed out)
  isDisabledIcon?: boolean, // grey out the icon, but still enable editing input
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  name: string,
  placeholder: string,
  type: "text" | "password",
  iconClassName?: string
}

const TextField: FunctionComponent<TextFieldProps> = (props: TextFieldProps) => {
  return <div className="text-field">
    <input
      type={props.type}
      name={props.name}
      className={
        "text-field-input"
        + (props.isErroneous ? " error" : "")
      }
      placeholder={props.placeholder}
      value={props.input}
      onChange={props.onChange}
      disabled={props.isDisabled}
    />
    {props.iconClassName && <i className={props.iconClassName
      + (props.isErroneous ? " error" : "")
      + (props.isDisabled || props.isDisabledIcon ? " disabled" : "")
    }/>}
  </div>
};

export { TextField };
export type { TextFieldProps };
