import React, { FunctionComponent, useState } from "react";
import SearchBar from "../atoms/SearchBar";

interface Props {
  filterRequestGroups: (searchString: string) => void,
}

const DonorSearchBar: FunctionComponent<Props> = (props: Props) => {
  
  const onSearchStringChange = (searchString: string) => {
    props.filterRequestGroups(searchString)
  }

  return <span>
    <SearchBar defaultText={"Search for a need or a type"} onSearchStringEnter={onSearchStringChange} searchOnEnter={true}/>
    <h3>Press enter to search</h3>
  </span>
};

export default DonorSearchBar;
