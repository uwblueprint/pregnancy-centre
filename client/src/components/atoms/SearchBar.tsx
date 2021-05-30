import React, { FunctionComponent, useState } from "react";

interface Props {
  defaultText: string,
  onSearchStringChange?: React.ChangeEventHandler<HTMLInputElement>,
  searchOnEnter?: boolean,
  onSearchStringEnter?: (searchString: string) => void
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
    const [searchString, setSearchString] = useState("");

  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
    if (props.onSearchStringChange) props.onSearchStringChange(event);
  }

  const searchStringChangeOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter"){
      event.preventDefault();
      const searchString: string = event.currentTarget.value;
      if (props.onSearchStringEnter) props.onSearchStringEnter(searchString);
    }
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  }

  return <span>
    <form>
      {props.searchOnEnter?
          <input className="search-bar" type="text" placeholder={props.defaultText} value={searchString} onKeyDown={searchStringChangeOnEnter} onChange={onSearchChange} />
          :<input className="search-bar" type="text" placeholder={props.defaultText} value={searchString} onChange={onSearchStringChange} />
      }
      <i className="bi-search search-bar-icon"></i>
    </form>
  </span>
};

export default SearchBar;
