import React, { FunctionComponent, useEffect, useState } from "react";

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
    if(!isDropdownOpened){
      props.onDropdownClose()
    }
  }, [isDropdownOpened])

  return <>
    {props.trigger}
    <span ref={dropdownReference}>
      {isDropdownOpened &&
        <ScrollWindow>
          {props.dropdownItems}
        </ScrollWindow>}
    </span>
  </>
};

export default SearchableDropdown;
