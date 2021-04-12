import React, { FunctionComponent, useState } from "react";

interface Props {
  defaultValue: number,
  isErroneous: boolean,
  isDisabled: boolean,
  onChange: (newNum: number) => void,
}

const InfiniteDropdown: FunctionComponent<Props> = (props: Props) => {
  const [selectedNumber, setSelectedNumber] = useState(-1);

  const onSelectChange = (num: number) => {
    setSelectedNumber(num);
    props.onChange(num);
  }

  return <span>
    <form>
      <input className="search-bar" type="text" placeholder={props.defaultText} value={searchString} onChange={onSearchStringChange} />
      <i className="bi-search search-bar-icon"></i>
    </form>
  </span>
};

export default InfiniteDropdown;
