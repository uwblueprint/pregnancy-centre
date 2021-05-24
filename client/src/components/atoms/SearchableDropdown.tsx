import React, { FunctionComponent, useState } from "react";

import ScrollWindow from "../atoms/ScrollWindow";
import Tag from "../atoms/Tag";
import { TextField } from "../atoms/TextField";
import { useComponentVisible } from "../utils/hooks";

interface Props {
  dropdownItems: Array<string>,
  initialText: string;
  isDisabled: boolean;
  isEmpty?: boolean;
  isErroneous: boolean,
  isTagDropdown?: boolean,
  noItemsAction: React.ReactNode;
  noResultsActionText: string,
  noResultsText: string,
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
  const { ref: dropdownReference, isComponentVisible: dropdownExpanded, setIsComponentVisible: setDropdownExpanded } = useComponentVisible(false);
  const [displayItems, setDisplayItems] = useState(sortedDropdownItems)
  const [noItems, setNoItems] = useState(props.dropdownItems.length > 0);

  const deactivateSearch = () => {
    setNoItems(props.dropdownItems.length > 0)
    setDropdownExpanded(false)
    setDisplayItems(sortedDropdownItems)
  }

  const displayMatchingItems = (newSearchString: string) => {
    setSearchString(newSearchString);
    setDropdownExpanded(true);

    const newDisplayItems = props.dropdownItems.filter((item) => searchStringMatches(newSearchString, item))
    console.log(newDisplayItems)
    setDisplayItems(newDisplayItems)
    setNoItems(newDisplayItems.length == 0);
  }

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);

    const newSearchString = event.target.value
    console.log(newSearchString)
    console.log(dropdownExpanded)
    console.log(displayItems)
    console.log(props.dropdownItems)

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
    setSearchString(item); // When the user focuses on the TextField, it should still be populated with the selected string
    deactivateSearch()
  };

  return (
    <div className="searchable-dropdown">
      <div
        className="textfield"
        onClick={() => {
          setDropdownExpanded(!dropdownExpanded && !props.isDisabled);
        }}
      >
        <TextField
          input={dropdownExpanded ? searchString : selectedString}
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
          {noItems || props.dropdownItems?.length === 0 ? (
            props.noItemsAction
          ) : (
              <div>
                <ScrollWindow>
                  <div className="dropdown-header">{props.placeholderText}</div>
                  {displayItems
                    .map((item) =>
                    (
                      props.isTagDropdown ?
                        <div className="dropdown-item dropdown-tag" key={item} onClick={() => onSelectedItemChange(item)}><Tag text={item} /></div>
                        : <div className="dropdown-item" key={item} onClick={() => onSelectedItemChange(item)}>{item}</div>

                    )
                    )}
                </ScrollWindow>
              </div>
            )}
        </span>
      )}
    </div>
  )
};

export default SearchableDropdown;
