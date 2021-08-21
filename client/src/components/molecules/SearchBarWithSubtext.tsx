import React, { FunctionComponent, useState } from "react";
import SearchBar from "../atoms/SearchBar";

interface Props {
    defaultText: string;
    subtext: string;
    searchWhileTyping: boolean;
    onSearch: (searchString: string) => void;
}

const SearchBarWithSubtext: FunctionComponent<Props> = (props: Props) => {
    const [showSubtext, setShowSubtext] = useState(false);

    return (
        <div className="search-bar-with-subtext-container">
            <SearchBar
                defaultText={props.defaultText}
                onEnterPressed={props.onSearch}
                onSearchStringChange={props.searchWhileTyping ? props.onSearch : undefined}
                setIsSearching={setShowSubtext}
            />
            <div className="subtext-container">
                <h3 className={showSubtext ? "subtext" : "subtext-transparent"}>{props.subtext}</h3>
            </div>
        </div>
    );
};

export default SearchBarWithSubtext;
