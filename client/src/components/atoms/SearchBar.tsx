import React, { FunctionComponent, useState } from "react";

interface Props {
    defaultText: string;
    onSearchStringChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
    const [searchString, setSearchString] = useState("");

    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
        props.onSearchStringChange(event);
    };

    return (
        <span>
            <form>
                <input
                    className="search-bar"
                    type="text"
                    placeholder={props.defaultText}
                    value={searchString}
                    onChange={onSearchStringChange}
                />
                <i className="bi-search search-bar-icon"></i>
            </form>
        </span>
    );
};

export default SearchBar;
