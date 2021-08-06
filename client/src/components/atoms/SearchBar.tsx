import React, { FunctionComponent, useState } from "react";

interface Props {
    defaultText: string;
    onSearchStringChange: (searchString: string) => void;
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
    const [searchString, setSearchString] = useState("");

    const onSearchStringChange = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSearchStringChange(searchString);
    };

    return (
        <span>
            <form onSubmit={onSearchStringChange}>
                <input
                    className="search-bar"
                    type="text"
                    placeholder={props.defaultText}
                    value={searchString}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setSearchString(e.target.value)}}
                />
                <i className="bi-search search-bar-icon"></i>
            </form>
        </span>
    );
};

export default SearchBar;
