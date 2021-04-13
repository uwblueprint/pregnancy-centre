import React, { FunctionComponent, useEffect, useState } from "react";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";

interface Props {
  defaultValue: number,
  isErroneous: boolean,
  isDisabled: boolean,
  onChange: (newNum: number) => void,
}

const InfiniteDropdown: FunctionComponent<Props> = (props: Props) => {
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [noItems, setNoItems] = useState(false);
  const nums : Array<number> = [];

  useEffect(() => {
    for (let i = 0; i < 1000; i++) {
      nums.push(i);
    }
  }, [nums]);

  const onSelectChange = (num: number) => {
    setSelectedNumber(num);
    setDropdownExpanded(false);
    props.onChange(num);
  }

  const onChangeDummy = (event: React.ChangeEvent<HTMLInputElement>) => {
  }

  return <div className="searchable-dropdown">
      <div className="textfield" onClick={() => {setDropdownExpanded(!dropdownExpanded)}}>
        <TextField
          input={selectedNumber + ""}
          isDisabled={true}
          isDisabledUI={dropdownExpanded}
          isErroneous={props.isErroneous}
          onChange={onChangeDummy}
          name="SearchableDropdown"
          placeholder={props.defaultValue + ""}
          type="text"
          iconClassName="bi bi-caret-down-fill"
          showRedErrorText={true}
        ></TextField>
        {dropdownExpanded &&
            <ScrollWindow>
                {nums.map(item =>
                  <div className="dropdown-item" key={item} onClick={() => onSelectChange(item)}>{item}</div>
                )}
            </ScrollWindow>
        }
      </div>
  </div>
};

export default InfiniteDropdown;
