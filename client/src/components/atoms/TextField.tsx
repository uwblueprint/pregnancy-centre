import React, { FunctionComponent } from "react";

interface TextFieldProps {
  input: string,
  isDisabled: boolean,
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  name: string,
  placeholder: string,
  type: "text" | "password",
}

const TextField: FunctionComponent<TextFieldProps> = (props: TextFieldProps) => {
  return <React.Fragment>
    <input
      type={props.type}
      name={props.name}
      className={
        "text-field" +
        (props.isErroneous ? " error" : "")
        + (props.type === "password" ? " password" : "")
      }
      placeholder={props.placeholder}
      value={props.input}
      onChange={props.onChange}
      disabled={props.isDisabled}
    />
  </React.Fragment>
};

export { TextField };
export type { TextFieldProps };
