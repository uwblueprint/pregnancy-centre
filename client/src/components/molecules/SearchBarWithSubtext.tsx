import React, { FunctionComponent, useState } from "react";
import SearchBar from "../atoms/SearchBar";
import { useSubscription } from "@apollo/client";

interface Props {
  filterRequestGroups: (searchString: string) => void;
  subtext: string;
}

const SearchBarWithSubtext: FunctionComponent<Props> = (props: Props) => {
  const onSearchStringChange = (searchString: string) => {
    props.filterRequestGroups(searchString);
  };
  const [showSubtext, setShowSubtext] = useState(false);

  return (
    <div className="search-bar-with-subtext-container">
      <SearchBar
        defaultText={"Search for a need or a type"}
        onSearchStringEnter={onSearchStringChange}
        searchOnEnter={true}
        setIsSearching={setShowSubtext}
      />
      <div className="subtext-container">
        <h3 className={showSubtext ? "subtext" : "subtext-transparent"}>
          {props.subtext}
        </h3>
      </div>
    </div>
  );
};

export default SearchBarWithSubtext;
