import React, { FunctionComponent, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

interface Props {
    defaultText: string;
    onSearchStringChange?: (searchString: string) => void;
    onEnterPressed?: (searchString: string) => void;
    setIsSearching?: (isFocused: boolean) => void;
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
    const [searchString, setSearchString] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isSearching = searchString !== "" || isFocused;
    props.setIsSearching?.(isSearching);

    useEffect(() => {
        if (searchInputRef.current !== null) {
            searchInputRef.current.onfocus = () => {
                setIsFocused(true);
            };
            searchInputRef.current.onblur = () => {
                setIsFocused(false);
            };
        }
    }, [searchInputRef.current]);

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
        props.onSearchStringChange?.(event.target.value);
    };

    const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            event.preventDefault();
            const searchString = event.currentTarget.value;
            props.onEnterPressed?.(searchString);
        }
    };

    return (
        <div className="search-bar-container">
            <input
                className="search-bar"
                type="text"
                ref={searchInputRef}
                placeholder={props.defaultText}
                value={searchString}
                onKeyDown={onSearchKeyDown}
                onChange={onSearchStringChange}
            />
            <div className="search-bar-icon-container">
                {isSearching ? (
                    <i role="button" onClick={() => setSearchString("")} className="bi-x-lg search-bar-icon-cancel"></i>
                ) : (
                    <i className="bi-search search-bar-icon-default"></i>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
