import React, { FunctionComponent, useRef } from "react";

import { useComponentVisible } from "../utils/hooks";

interface Props {
    trigger: React.ReactNode;
    children: React.ReactNode;
}

const DropdownMenu: FunctionComponent<Props> = (props: Props) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const {
        ref: dropdownReference,
        isComponentVisible: isMenuOpen,
        setIsComponentVisible: setIsMenuOpen
    } = useComponentVisible(false, triggerRef);

    return (
        <div className="dropdown-menu-atom">
            <div
                className="trigger"
                onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                }}
                ref={triggerRef}
            >
                {props.trigger}
            </div>
            {isMenuOpen && (
                <div
                    className="menu-anchor"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                    ref={dropdownReference}
                >
                    <div className="menu">
                      {props.children}
                      </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
