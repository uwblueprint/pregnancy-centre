import React, { FunctionComponent } from "react";

interface TextFieldProps {
  input: string,
  isDisabled: boolean,
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  name: string,
  placeholder: string,
  type: "text" | "password",
  iconClassName?: string,
  onIconClick?: React.MouseEventHandler<HTMLElement>
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
    {props.iconClassName && <i
      onClick={props.onIconClick ? props.onIconClick : () => {}}
      className={props.iconClassName
        + (props.isErroneous ? " error" : "")
        + (props.isDisabled ? " disabled" : "")
      } />}
  </div>
};

export { TextField };
export type { TextFieldProps };
