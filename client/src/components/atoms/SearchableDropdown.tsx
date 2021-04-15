import React, { FunctionComponent, useEffect, useState } from "react";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";

interface Props {
  initialText: string;
  placeholderText: string;
  searchPlaceholderText: string;
  dropdownItems: Array<string>;
  isErroneous: boolean;
  isDisabled: boolean;
  isEmpty?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSelect: (item: string) => void;
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const [searchString, setSearchString] = useState(props.initialText);
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [noItems, setNoItems] = useState(false);

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);

    if (!dropdownExpanded) {
      setDropdownExpanded(true);
    }
    setSearchString(event.target.value);
    if (
      event.target.value.length > 0 &&
      props.dropdownItems.filter((item) =>
        item
          .toLocaleLowerCase()
          .startsWith(event.target.value.toLocaleLowerCase())
      ).length == 0
    ) {
      setNoItems(true);
    } else {
      setNoItems(false);
    }
  };

  const onSelectedItemChange = (item: string) => {
    props.onSelect(item);
    setSearchString(item);
    setDropdownExpanded(false);
  };

  useEffect(() => {
    if (props.isEmpty) {
      setSearchString("");
    }
  }, [props.isEmpty]);

  return (
    <div className="searchable-dropdown">
      <div
        className="textfield"
        onClick={() => {
          setDropdownExpanded(!dropdownExpanded && !props.isDisabled);
        }}
      >
        <TextField
          input={searchString}
          isDisabled={props.isDisabled}
          isDisabledUI={dropdownExpanded}
          isErroneous={props.isErroneous}
          onChange={onSearchStringChange}
          name="SearchableDropdown"
          placeholder={
            dropdownExpanded
              ? props.searchPlaceholderText
              : props.placeholderText
          }
          type="text"
          iconClassName="bi bi-caret-down-fill"
          showRedErrorText={true}
          autocompleteOff={true}
        ></TextField>
      </div>
      {dropdownExpanded && (
        <span>
          {noItems ? (
            <div className="no-items-found">
              <span className="not-exist-msg">This group does not exist</span>
              <span className="create-group">
                <a>
                  <span>Create a new group</span>
                  <i className="bi bi-arrow-right-short"></i>
                </a>
              </span>
            </div>
          ) : (
            <div>
              <ScrollWindow>
                <div className="dropdown-header">{props.placeholderText}</div>
                {props.dropdownItems
                  .filter((item) =>
                    item
                      .toLocaleLowerCase()
                      .startsWith(searchString.toLocaleLowerCase())
                  )
                  .map((item) => (
                    <div
                      className="dropdown-item"
                      key={item}
                      onClick={() => onSelectedItemChange(item)}
                    >
                      {item}
                    </div>
                  ))}
              </ScrollWindow>
            </div>
          )}
        </span>
      )}
    </div>
  );
};

export default SearchableDropdown;
