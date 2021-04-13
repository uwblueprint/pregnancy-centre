import React, { FunctionComponent } from "react";

interface TextFieldProps {
  input: string,
  isDisabled: boolean, // the entire text field is disabled (can't enter input + everything greyed out)
  isDisabledUI?: boolean, // grey out the icon and placeholder, but still enable editing input  isErroneous: boolean,
  isErroneous: boolean,
  // by default, when there is an error, the border is highlighted in red but the text is still black
  // when showRedErrorText is true, when there is an error the text will also be highlighted in red
  showRedErrorText?: boolean,
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
        + (props.isDisabled || props.isDisabledUI ? " disabled" : "")
      } />}
  </div>
};

export { TextField };
export type { TextFieldProps };
