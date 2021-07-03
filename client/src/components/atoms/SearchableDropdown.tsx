import React, { FunctionComponent, useState } from "react";

import ScrollableDropdown from "../atoms/ScrollableDropdown";
import Tag from "../atoms/Tag";
import { TextField } from "../atoms/TextField";

interface Props {
    dropdownItems: Array<string>;
    selectedItem: string;
    searchString: string;
    initialText: string;
    isDisabled: boolean;
    isErroneous: boolean;
    isTagDropdown?: boolean;
    noItemsAction?: React.ReactNode;
    actionOption?: React.ReactNode;
    onChange: (item: string) => void;
    onSelect: (item: string) => void;
    placeholderText: string;
    searchPlaceholderText: string;
    dropdownPrompt?: string;
}

const SearchableDropdown: FunctionComponent<Props> = (props: Props) => {
    const sortedDropdownItems = props.dropdownItems.sort(function (a, b) {
        // Case-insensitive alphabetical sort
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    const [isDropdownOpened, setIsDropdownOpened] = useState(false);
    const [displayItems, setDisplayItems] = useState(sortedDropdownItems);

    const displayMatchingItems = (newSearchString: string) => {
        const newDisplayItems =
            newSearchString.length === 0
                ? props.dropdownItems
                : props.dropdownItems.filter((item) => searchStringMatches(newSearchString, item));
        setDisplayItems(newDisplayItems);
    };

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchString = event.target.value;
        props.onChange(newSearchString);
        displayMatchingItems(newSearchString);
    };

    const searchStringMatches = (searchString: string, otherString: string) => {
        if (searchString.length === 0) return false;

        return otherString.toLocaleLowerCase().startsWith(searchString.toLocaleLowerCase());
    };

    const onSelectedItemChange = (item: string) => {
        props.onSelect(item);
        setIsDropdownOpened(false);
    };

    const getDisplayItemsHTML = () => {
        return displayItems.map((item) =>
            props.isTagDropdown ? (
                <div className="dropdown-item dropdown-tag" key={item} onClick={() => onSelectedItemChange(item)}>
                    <Tag text={item} />
                </div>
            ) : (
                <div className="dropdown-item" key={item} onClick={() => onSelectedItemChange(item)}>
                    {item}
                </div>
            )
        );
    };

    return (
        <div className="searchable-dropdown">
            <ScrollableDropdown
                dropdownItems={
                    displayItems.length === 0 && props.actionOption == null ? (
                        <div className="dropdown-action">{props.noItemsAction}</div>
                    ) : (
                        <>
                            {props.dropdownPrompt && <div className="dropdown-header">{props.dropdownPrompt}</div>}
                            {props.actionOption && (
                                <div className="dropdown-item" onClick={() => setIsDropdownOpened(false)}>
                                    {props.actionOption}
                                </div>
                            )}
                            {getDisplayItemsHTML()}
                        </>
                    )
                }
                trigger={
                    <TextField
                        input={isDropdownOpened ? props.searchString : props.selectedItem}
                        isDisabled={props.isDisabled}
                        isDisabledUI={isDropdownOpened}
                        isErroneous={props.isErroneous}
                        onChange={onSearchStringChange}
                        name="SearchableDropdown"
                        placeholder={isDropdownOpened ? props.searchPlaceholderText : props.placeholderText}
                        type="text"
                        iconClassName="bi bi-caret-down-fill"
                        showRedErrorText={true}
                        autocompleteOff={true}
                        focusOnIconClick={true}
                    />
                }
                onDropdownOpen={() => {
                    setIsDropdownOpened(true);
                    displayMatchingItems(props.selectedItem); // When the user focuses on the TextField, it should still be populated with the selected string
                }}
                onDropdownClose={() => {
                    props.onChange(props.selectedItem);
                    setIsDropdownOpened(false);
                }}
                isDropdownOpened={isDropdownOpened}
            />
        </div>
    );
};

export default SearchableDropdown;
