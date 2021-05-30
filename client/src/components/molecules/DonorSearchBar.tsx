import React, { FunctionComponent } from "react";
import SearchBar from "../atoms/SearchBar";

interface Props {
  filterRequestGroups: (searchString: string) => void,
}

const DonorSearchBar: FunctionComponent<Props> = (props: Props) => {
  const onSearchStringChange = (searchString: string) => {
    props.filterRequestGroups(searchString)
  }

  return <div className="donor-search-bar">
    <SearchBar defaultText={"Search for a need or a type"} onSearchStringEnter={onSearchStringChange} searchOnEnter={true}/>
    <div className="donor-search-bar-subtext-container">
        <h3 className="donor-search-bar-subtext">Press enter to search</h3>
    </div>
  </div>
};

export default DonorSearchBar;
