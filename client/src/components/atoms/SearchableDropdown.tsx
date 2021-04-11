import React, { FunctionComponent, useState } from "react";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";

interface Props {
  placeholderText: string,
  searchPlaceholderText: string,
  dropdownItems?: Array<React.ReactNode>,
  dropdownItemsText: Array<string>,
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [noItems, setNoItems] = useState(false);

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);
    setSearchString(event.target.value);
    if (event.target.value.length > 0 && props.dropdownItemsText.filter(item => item.startsWith(event.target.value)).length == 0) {
      setNoItems(true);
    } else {
      setNoItems(false);
    }
  }

  const onSelectedItemChange = (item: string) => {
    setSearchString(item);
    setDropdownExpanded(false);
  }

  return <div className="searchable-dropdown">
      <div onClick={() => {setDropdownExpanded(!dropdownExpanded)}} style={{ marginBottom: "5px"}}>
        <TextField
          input={searchString}
          isDisabled={false}
          isDisabledUI={dropdownExpanded}
          isErroneous={props.isErroneous}
          onChange={onSearchStringChange}
          name="SearchableDropdown"
          placeholder={dropdownExpanded ? props.searchPlaceholderText : props.placeholderText}
          type="text"
          iconClassName="bi bi-caret-down-fill"
        ></TextField>
      </div>
      {dropdownExpanded && noItems &&
        <div className="no-items-found">
          <span className="not-exist-msg">This group does not exist</span>
          <span className="create-group"><a><span>Create a new group</span><i className="bi bi-arrow-right-short"></i></a></span>
        </div>
      }
      {dropdownExpanded && !noItems &&
        <ScrollWindow>
          <div className="dropdown-header">{props.placeholderText}</div>
          {props.dropdownItemsText.filter(item => item.startsWith(searchString)).map((item, idx) =>
            <div className={"dropdown-item" + (props.dropdownItems ? " tag" : "")} key={item} onClick={() => onSelectedItemChange(item)}>{props.dropdownItems ? props.dropdownItems[idx] : item}</div>
          )}
        </ScrollWindow>
      }
  </div>
};

export default SearchableDropdown;
