import React, { FunctionComponent, useState } from "react";

interface Props {
    title: string;
    header?: React.ReactElement;
    body: React.ReactElement;
}

const Dropdown: FunctionComponent<Props> = (props: Props) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <div className="dropdown">
            <div className="dropdown-wrapper">
                <div tabIndex={0} className="dropdown-header" role="button" onClick={() => toggle()}>
                    <div className="dropdown-header__title">
                        <p className={"dropdown-header__title--bold-" + (open ? "open" : "closed")}>{props.title}</p>
                    </div>
                    <div className="dropdown-header__action">{props.header}</div>
                </div>
                <div className={"dropdown-body-" + (open ? "open" : "closed")}>{props.body}</div>
            </div>
        </div>
    );
};

export default Dropdown;
