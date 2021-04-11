import React, { FunctionComponent, useEffect, useState } from "react";
import { TextField } from "./TextField";

interface TextFieldWithActionProps {
  isErroneous: boolean,
  onChange: (value: string) => boolean,
  onSubmit: (value: string) => void,
  showAction: boolean,
  placeholder: string,
  type: "text",
  actionString: string,
  iconClassName?: string
}

const TextFieldWithAction: FunctionComponent<TextFieldWithActionProps> = (props: TextFieldWithActionProps) => {
    const [value, setValue] = useState("");
    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if( e.key == 'Enter' ){
            if (props.showAction){
                if (value !== ""){
                    props.onSubmit(value);
                    setValue(""); 
                }
            }
        }
    }
    useEffect(() => {
        props.onChange(value);
    });
    return (
    <div className="text-field-with-action">
        <div onKeyDown={handleKeyDown}>        
            <TextField input={value} isDisabled={false} isErroneous={props.isErroneous} onChange={onTextChange} name="text-field-action" placeholder={props.placeholder} type={props.type} iconClassName={props.iconClassName} ></TextField>
        </div>
        {props.showAction &&  
            <div>
                <a onClick={()=>{
                    if (value !== ""){props.onSubmit(value);}
                    setValue("");
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