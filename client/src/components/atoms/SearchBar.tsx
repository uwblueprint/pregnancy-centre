import React, { FunctionComponent, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

interface Props {
  defaultText: string;
  onSearchStringChange?: React.ChangeEventHandler<HTMLInputElement>;
  searchOnEnter?: boolean;
  onSearchStringEnter?: (searchString: string) => void;
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
    if (props.onSearchStringChange) props.onSearchStringChange(event);
  };

  const searchStringChangeOnEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key == "Enter") {
      event.preventDefault();
      const searchString: string = event.currentTarget.value;
      if (props.onSearchStringEnter) props.onSearchStringEnter(searchString);
    }
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <span>
        <form>
          {props.searchOnEnter ? (
            <input
              className="search-bar"
              type="text"
              ref={searchInputRef}
              placeholder={props.defaultText}
              value={searchString}
              onKeyDown={searchStringChangeOnEnter}
              onChange={onSearchChange}
            />
          ) : (
            <input
              className="search-bar"
              type="text"
              ref={searchInputRef}
              placeholder={props.defaultText}
              value={searchString}
              onChange={onSearchStringChange}
            />
          )}
          <div className="search-bar-icon-container">
            {isSearching ? (
              <i
                role="button"
                onClick={() => setSearchString("")}
                className="bi-x-lg search-bar-icon-cancel"
              ></i>
            ) : (
              <i className="bi-search search-bar-icon-default"></i>
            )}
          </div>
        </form>
      </span>
    </div>
  );
};

export default SearchBar;
