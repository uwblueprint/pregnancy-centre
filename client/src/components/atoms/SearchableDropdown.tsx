import React, { FunctionComponent, useEffect, useState } from "react";

import ScrollableDropdown from '../atoms/ScrollableDropdown'
import Tag from "../atoms/Tag";
import { TextField } from "../atoms/TextField";

interface Props {
  dropdownItems: Array<string>,
  initialText: string;
  isDisabled: boolean;
  isEmpty?: boolean;
  isErroneous: boolean;
  isTagDropdown?: boolean;
  noItemsAction: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onSelect: (item: string) => void;
  placeholderText: string;
  searchPlaceholderText: string;
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
  const sortedDropdownItems = props.dropdownItems.sort(function (a, b) { // Case-insensitive alphabetical sort
    return a.toLowerCase().localeCompare(b.toLowerCase());
  })

  const [searchString, setSearchString] = useState(props.initialText);
  const [selectedString, setSelectedString] = useState(props.initialText);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false)
  const [displayItems, setDisplayItems] = useState(sortedDropdownItems)

  useEffect(() => {
    if (props.isEmpty) {
      setSelectedString("");
    }
  }, [props.isEmpty])

  const deactivateSearch = () => {
    setIsDropdownOpened(false)
    setDisplayItems(sortedDropdownItems)
  }

  const displayMatchingItems = (newSearchString: string) => {
    setSearchString(newSearchString);
    setIsDropdownOpened(true);

    const newDisplayItems = newSearchString.length === 0 ? props.dropdownItems : props.dropdownItems.filter((item) => searchStringMatches(newSearchString, item))
    setDisplayItems(newDisplayItems)
  }

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);
    const newSearchString = event.target.value
    displayMatchingItems(newSearchString)
  };

  const searchStringMatches = (searchString: string, otherString: string) => {
    if (searchString.length === 0) return false;

    return otherString
      .toLocaleLowerCase()
      .startsWith(searchString.toLocaleLowerCase())
  }

  const onSelectedItemChange = (item: string) => {
    props.onSelect(item);
    setSelectedString(item);
    deactivateSearch()
  };

  const getDisplayItemsHTML = () => {
    return displayItems.map((item) => (
      props.isTagDropdown ?
        <div className="dropdown-item dropdown-tag" key={item} onClick={() => onSelectedItemChange(item)}><Tag text={item} /></div>
        : <div className="dropdown-item" key={item} onClick={() => onSelectedItemChange(item)}>{item}</div>
    ))
  }

  return (
    <div className="searchable-dropdown">
      <ScrollableDropdown
        dropdownItems={
          displayItems.length === 0
            ? <div className="dropdown-action">{props.noItemsAction}</div>
            : <>
              <div className="dropdown-header">{props.placeholderText}</div>
              {getDisplayItemsHTML()}
            </>

        }
        trigger={
          <div
            className="textfield"
            onClick={() => {
              setIsDropdownOpened(!isDropdownOpened && !props.isDisabled);
              displayMatchingItems(selectedString)  // When the user focuses on the TextField, it should still be populated with the selected string
            }}
          >
            <TextField
              input={isDropdownOpened ? searchString : selectedString}
              isDisabled={props.isDisabled}
              isDisabledUI={isDropdownOpened}
              isErroneous={props.isErroneous}
              onChange={onSearchStringChange}
              name="SearchableDropdown"
              placeholder={
                isDropdownOpened
                  ? props.searchPlaceholderText
                  : props.placeholderText
              }
              type="text"
              iconClassName="bi bi-caret-down-fill"
              showRedErrorText={true}
              autocompleteOff={true}
            ></TextField>
          </div>
        }
        onDropdownClose={() => { deactivateSearch() }}
        isDropdownOpened={isDropdownOpened}
      />
    </div>
  )
};

export default SearchableDropdown;
