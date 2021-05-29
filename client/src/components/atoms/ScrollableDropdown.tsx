import React, { FunctionComponent, useEffect } from "react";

import ScrollWindow from "../atoms/ScrollWindow";
import { useComponentVisible } from "../utils/hooks";

interface Props {
  dropdownItems: React.ReactNode,
  trigger: React.ReactNode
  onDropdownClose: () => void
  onDropdownOpen: () => void
  isDropdownOpened: boolean
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const { ref: dropdownReference, isComponentVisible: isDropdownOpened, setIsComponentVisible: setIsDropdownOpened } = useComponentVisible(props.isDropdownOpened);

  useEffect(() => {
    setIsDropdownOpened(props.isDropdownOpened)
  }, [props.isDropdownOpened])

  useEffect(() => {
    if (isDropdownOpened) {
      props.onDropdownOpen()
    }
    else {
      props.onDropdownClose()
    }
  }, [isDropdownOpened])

  return <div className="scrollable-dropdown">
    <div onClick={() => {
      if (!isDropdownOpened) {
        setIsDropdownOpened(true)
      }
    }}>
      {props.trigger}
    </div>

    {isDropdownOpened &&
      <div ref={dropdownReference} className="dropdown">
        <ScrollWindow>
          {props.dropdownItems}
        </ScrollWindow>
      </div>
    }

  </div>
};

export default SearchableDropdown;
