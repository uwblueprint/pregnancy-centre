import React, { FunctionComponent, useState } from "react";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";

interface Props {
  placeholderText: string,
  dropdownItems: Array<string>,
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
    props.onChange(event);
  }

  const onSelectedItemChange = (item: string) => {
    setSelectedItem(item);
    setSearchString(item);
    setDropdownExpanded(false);
  }

  return <div className="searchable-dropdown">
      <div onClick={() => {setDropdownExpanded(!dropdownExpanded)}} style={{ marginBottom: "5px"}}>
        <TextField
          input={searchString}
          isDisabled={false}
          isDisabledIcon={dropdownExpanded}
          isErroneous={props.isErroneous}
          onChange={onSearchStringChange}
          name="SearchableDropdown"
          placeholder={props.placeholderText}
          type="text"
          iconClassName="bi bi-caret-down-fill"
        ></TextField>
      </div>
      {dropdownExpanded &&
        <ScrollWindow>
          <div className="dropdown-header">Select a group</div>
          {props.dropdownItems.filter(item => item.startsWith(searchString)).map(item =>
            <div className="dropdown-item" key={item} onClick={() => onSelectedItemChange(item)}>{item}</div>
          )}
        </ScrollWindow>
      }
  </div>
};

export default SearchableDropdown;
