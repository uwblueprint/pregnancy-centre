import React, { FunctionComponent, useState } from "react";
import SearchBar from "../atoms/SearchBar";

interface Props {
  filterRequestGroups: React.ChangeEventHandler<string>,
}

const DonorSearchBar: FunctionComponent<Props> = (props: Props) => {
  
  const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handle search string change
    // if searchString.length > 0 { props.filterRequestGroups} 
    // the parent container DonorRequestGroupBrowser for search bar should filter the request groups
  }

  return <span>
    <SearchBar defaultText={"Search for a need or a type"} onSearchStringChange={onSearchStringChange} searchOnEnter={true}/>
    <h3>Press enter to search</h3>
  </span>
};

export default DonorSearchBar;
