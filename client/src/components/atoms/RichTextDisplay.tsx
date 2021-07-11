import { convertFromRaw, Editor, EditorState } from "draft-js";
import React, { FunctionComponent, useEffect } from "react";

interface Props {
    content: string;
}

const RichTextDisplay: FunctionComponent<Props> = (props: Props) => {
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

    useEffect(() => {
        if (props.content) {
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(props.content))));
        }
    }, [props.content]);

    return (
        <div className="richtext-display">
            <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
        </div>
    );
};

export default RichTextDisplay;
