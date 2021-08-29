import React, { FunctionComponent, useState } from "react";

import TextArea from "../atoms/TextArea";

const TextAreaContainer: FunctionComponent<Record<string, never>> = () => {
    const [value, setValue] = useState("");

    return (
        <div style={{ width: "50%", margin: "100px" }}>
            <TextArea
                isErroneous={false}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value)}
                placeholder="enter text"
                value={value}
                label="Label"
                maxNumChars={20}
            />
        </div>
    );
};

export default TextAreaContainer;
