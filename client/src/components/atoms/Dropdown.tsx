import './style/Dropdown.scss';
import React, { FunctionComponent, useState } from 'react';

interface Props {
    title: string
    header?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>  
    body: any
}

const Dropdown:  FunctionComponent<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
    
  return (
      <div>
        <div className="dd-wrapper">
            <div
                tabIndex={0}
                className="dd-header"
                role="button"
                onKeyPress={() => toggle()}
                onClick={() => toggle()}
            >
                <div className="dd-header__title">
                <p className="dd-header__title--bold">{props.title}</p>
                </div>
                <div className="dd-header__action">
                    {props.header}
                </div>
            </div>
            {open && (
                props.body
            )}
            </div>
      </div>
  );
}

export default Dropdown;
