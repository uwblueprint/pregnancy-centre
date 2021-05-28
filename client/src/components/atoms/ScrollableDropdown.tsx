import React, { FunctionComponent, useEffect } from "react";

import ScrollWindow from "../atoms/ScrollWindow";
import { useComponentVisible } from "../utils/hooks";

interface Props {
  dropdownItems: React.ReactNode,
  trigger: React.ReactNode
  onDropdownClose: () => void
  isDropdownOpened: boolean
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const { ref: dropdownReference, isComponentVisible: isDropdownOpened, setIsComponentVisible: setIsDropdownOpened } = useComponentVisible(false);

  useEffect(() => {
    setIsDropdownOpened(props.isDropdownOpened)
  }, [props.isDropdownOpened])

  useEffect(() => {
    if (!isDropdownOpened) {
      props.onDropdownClose()
    }
  }, [isDropdownOpened])

  return <div className="scrollable-dropdown">
    {props.trigger}
    <span ref={dropdownReference} className="dropdown">
      {isDropdownOpened &&
        <ScrollWindow>
          {props.dropdownItems}
        </ScrollWindow>
      }
    </span>
  </div>
};

export default SearchableDropdown;
