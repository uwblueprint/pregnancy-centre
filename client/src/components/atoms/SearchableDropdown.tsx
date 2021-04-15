import React, { FunctionComponent, useEffect, useState } from "react";
import ScrollWindow from "../atoms/ScrollWindow";
import { TextField } from "../atoms/TextField";
import { useComponentVisible } from "../utils/hooks";

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
  noItemsAction: React.ReactNode;
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const [searchString, setSearchString] = useState(props.initialText);
  const [selectedString, setSelectedString] = useState(props.initialText);
  const { ref: dropdownReference, isComponentVisible: dropdownExpanded, setIsComponentVisible: setDropdownExpanded } = useComponentVisible(false);
  const [noItems, setNoItems] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);
    setFilterEnabled(true);
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
    setSelectedString(item);
    setSearchString(item);
    setFilterEnabled(false);
    setDropdownExpanded(false);
  };

  useEffect(() => {
    if (props.isEmpty) {
      
      setSearchString("");
    }
  }, [props.isEmpty]);

  useEffect(() => {
    if (!dropdownExpanded) {
      setFilterEnabled(false)
      setSearchString(selectedString)
      if (selectedString) {
        props.onSelect(selectedString);
      }
    }
  }, [dropdownExpanded])

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
        <span ref={dropdownReference}>
          {noItems ? (
            props.noItemsAction
          ) : (
              <div>
                <ScrollWindow>
                  <div className="dropdown-header">{props.placeholderText}</div>
                  {props.dropdownItems
                    .filter((item) =>
                      filterEnabled
                        ? item
                          .toLocaleLowerCase()
                          .startsWith(searchString.toLocaleLowerCase())
                        : item.length > 0
                    )
                    .sort(function (a, b) {
                      return a.toLowerCase().localeCompare(b.toLowerCase());
                    })
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
