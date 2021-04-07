import React, { FunctionComponent, useEffect, useState } from "react";
import { TextField } from "./TextField";

interface TextFieldWithActionProps {
  isErroneous: boolean,
  onChange: (value: string) => boolean,
  onSubmit: (value: string) => void,
  showAction: boolean,
  placeholder: string,
  type: "text" | "password",
  actionString: string,
  iconClassName?: string
}

const TextFieldWithAction: FunctionComponent<TextFieldWithActionProps> = (props: TextFieldWithActionProps) => {
    const [value, setValue] = useState("");
    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
    }
    useEffect(() => {
        props.onChange(value);
    });
    return (
    <div className="text-field-with-action">
        <TextField input={value} isDisabled={false} isErroneous={props.isErroneous} onChange={onTextChange} name="text-field-action" placeholder={props.placeholder} type={props.type} iconClassName={props.iconClassName} ></TextField>
        {props.showAction &&  
            <div>
                <a onClick={()=>{
                    setValue("");
                    props.onSubmit(value);
                    }}>
                    <div className={"action" + (props.isErroneous ? " error" : "")}>
                        <div className="action-string">{props.actionString}</div>
                        <div className="action-value"><span className="action-value-text">{value}</span></div>
                    </div>
                </a>
            </div>
        }
    </div>
    );
};

export { TextFieldWithAction };
export type { TextFieldWithActionProps };