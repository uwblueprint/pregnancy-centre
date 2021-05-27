import React, { FunctionComponent, useState } from "react";

interface Props {
  defaultText: string,
  onSearchStringChange: React.ChangeEventHandler<HTMLInputElement>,
  searchOnEnter?: boolean,
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
    const [searchString, setSearchString] = useState("");

    const onSearchStringChange = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSearchStringChange(searchString);
    };

  return <span>
    <form>
      {props.searchOnEnter?
          <input className="search-bar" type="text" placeholder={props.defaultText} value={searchString} onKeyDown={()=>onSearchStringChange} />
          :<input className="search-bar" type="text" placeholder={props.defaultText} value={searchString} onChange={onSearchStringChange} />
      }
      <i className="bi-search search-bar-icon"></i>
    </form>
  </span>
};

export default SearchBar;
