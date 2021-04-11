import React, { FunctionComponent, useState } from "react";
import { Tag, TagProps } from "../atoms/Tag";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";

interface Props {
  placeholderText: string,
  searchPlaceholderText: string,
  noResultsText: string,
  noResultsActionText: string,
  dropdownItemsText: Array<string>,
  dropdownTags?: Array<TagProps>,
  isErroneous: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [noItems, setNoItems] = useState(false);

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);
    if (!dropdownExpanded) {
        setDropdownExpanded(true);
    }
    setSearchString(event.target.value);
    if (event.target.value.length > 0) {
        if (props.dropdownTags) {
            if (props.dropdownTags.filter(item => item.text.startsWith(event.target.value)).length == 0) {
                setNoItems(true);
            }
        } else {
            if (props.dropdownItemsText.filter(item => item.startsWith(event.target.value)).length == 0) {
                setNoItems(true);
            }
        }
    } else {
      setNoItems(false);
    }
  }

  const onSelectedItemChange = (item: string) => {
    setSearchString(item);
    setDropdownExpanded(false);
  }

  return <div className="searchable-dropdown">
      <div className="textfield" onClick={() => {setDropdownExpanded(!dropdownExpanded)}}>
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
          showRedErrorText={true}
        ></TextField>
      </div>
      {dropdownExpanded && noItems &&
        <div className="no-items-found">
          <span className="not-exist-msg">{props.noResultsText}</span>
          <span className="create-group"><a><span>{props.noResultsActionText}</span><i className="bi bi-arrow-right-short"></i></a></span>
        </div>
      }
      {dropdownExpanded && !noItems &&
        <ScrollWindow>
          <div className="dropdown-header">{props.placeholderText}</div>
          {props.dropdownTags && props.dropdownTags.filter(item => item.text.toLocaleLowerCase().startsWith(searchString.toLocaleLowerCase())).map(item =>
            <div className="dropdown-item tag" key={item.text} onClick={() => onSelectedItemChange(item.text)}><Tag text={item.text} small/></div>
          )}
          {!props.dropdownTags && props.dropdownItemsText.filter(item => item.toLocaleLowerCase().startsWith(searchString.toLocaleLowerCase())).map(item =>
            <div className={"dropdown-item"} key={item} onClick={() => onSelectedItemChange(item)}>{item}</div>
          )}
        </ScrollWindow>
      }
  </div>
};

export default SearchableDropdown;
