import { convertFromRaw, convertToRaw, Editor, EditorState, getDefaultKeyBinding, KeyBindingUtil, Modifier, RichUtils, SelectionState } from 'draft-js';
import React, { FunctionComponent } from 'react';

import ScrollWindow from './ScrollWindow';

interface Props {
    initialContent: string // content in the stringified form of a ContentState (i.e. derived from using RichTextField)
    // this should not be reactive! (not updated onChange)
    // how to use: for editing pre-existing content (e.g. on editing a requestGroup's description),
    //             pass the previous description into initialContent
    defaultText: string // text to show if no content in input field
    onChange: (content: string) => void // called with stringified form of current ContentState
    onEmpty?: () => void
    isErroneous: boolean // for styling when the input is erroneous
}

const RichTextField: FunctionComponent<Props> = (props: Props) => {
    const [active, setActive] = React.useState(false) // whether we have entered any content beyond the default text
    const [empty, setEmpty] = React.useState(true)
    const [changeMade, setChangeMade] = React.useState(false)
    const [editorState, setEditorState] = React.useState(
        props.initialContent ?
            EditorState.createWithContent(convertFromRaw(JSON.parse(props.initialContent))) :
            EditorState.createEmpty())

    const { hasCommandModifier } = KeyBindingUtil; // utility
    // for each key input, map keys to commands conditionally
    function keyBindings(e: React.KeyboardEvent): string | null {
        const selection = editorState.getSelection()
        const block = editorState.getCurrentContent().getBlockForKey(selection.getAnchorKey())

        // CTRL+B (or CMD+B on Mac)
        if (e.key === "b" && hasCommandModifier(e)) {
            return 'bold'
        }

        // If we are entering a space " " that is the second character in the block and the first character is "-"
        // then make this block an unordered list if it is not already one
        if (e.key === " " && selection.getAnchorOffset() === 1 && block.getText().trim().charAt(0) === "-" && block.getType() !== 'unordered-list-item') {
            return 'make-list'
        }

        // If we are hitting backspace on an empty block with styling, we want the block to be reset to default styling
        // E.g.: backspace on an empty unordered list removes the list, backspace once more then can remove the block
        if (e.key === "Backspace" && block.getType() !== 'unstyled' && block.getText().length === 0) {
            return 'remove-block-styling'
        }

        return getDefaultKeyBinding(e) // standard input (e.g. typing "e" inputs "e" at cursor, backspace deletes char before cursor)
    }

    function onChange(state: EditorState) {
        // current component state
        let isEmpty = empty
        let hasChangeMade = changeMade

        // if user is typing content, so this is active
        if (!active) {
            setActive(true)
        }

        // check if state has no text
        const hasContent = state.getCurrentContent().getPlainText() !== ""
        if (!hasContent && state.getCurrentContent().getFirstBlock().getType() === 'unstyled') {
            isEmpty = true
            setEmpty(true)
            // check if we are already typing (we are active) and 
            if (active) {
                // if so, we made the content empty, so add back the default text
                setActive(false)
            }
        } else {
            isEmpty = false
            setEmpty(false)
        }

        if ((isEmpty && hasChangeMade) || (!isEmpty && !hasChangeMade)) {
            hasChangeMade = true
            setChangeMade(true);
        }

        if (props.onEmpty && isEmpty && hasChangeMade) {
            props.onEmpty()
        } else if (!isEmpty && hasChangeMade) {
            props.onChange(JSON.stringify(convertToRaw(state.getCurrentContent())));
        }

        setEditorState(state);
    }

    // NOTE: to simplify how this works, the logic for when each command comes into play
    //       is almost entirely in keyBindings
    function handleKeyCommand(command: string, state: EditorState) {
        const selection = state.getSelection()
        const block = editorState.getCurrentContent().getBlockForKey(selection.getAnchorKey())

        if (command === 'bold') {
            // sets selection to 'BOLD' style, or if nothing is selected, the
            // internal style (for new input) is set to 'BOLD'
            onChange(RichUtils.toggleInlineStyle(state, 'BOLD'))
            return 'handled'
        }

        if (command === 'make-list') {
            let modifiedContent = state.getCurrentContent()

            // if the first character is "-", we have to remove this before making the block an unordered list
            if (block.getText().trim().charAt(0) === "-") {
                // select first char
                const replacementRange = new SelectionState({
                    anchorKey: selection.getAnchorKey(),
                    anchorOffset: 0,
                    focusKey: selection.getFocusKey(),
                    focusOffset: 1
                })

                // remove first char
                modifiedContent = Modifier.replaceText(state.getCurrentContent(), replacementRange, "")
            }

            // modify state to reflect we deleted a character and then change current block to unordered list
            const modifiedState = RichUtils.toggleBlockType(EditorState.push(state, modifiedContent, 'delete-character'), 'unordered-list-item')

            // select start of this new unordered list
            const newSelection = new SelectionState({
                anchorKey: modifiedState.getSelection().getAnchorKey(),
                anchorOffset: 0,
                focusKey: modifiedState.getSelection().getAnchorKey(),
                focusOffset: 0
            })

            // update state with this selection and modifications to the state
            onChange(EditorState.forceSelection(modifiedState, newSelection))
            return 'handled'
        }

        if (command === 'remove-block-styling') {
            onChange(RichUtils.toggleBlockType(state, 'unstyled'))
            return 'handled'
        }

        return 'not-handled'
    }

    // called by buttons (via onMouseDown) that act as controls for the field
    function handleControlMouseDown(e: React.MouseEvent<HTMLElement>, modifiedState: EditorState) {
        e.preventDefault()
        onChange(modifiedState)
    }

    return (
        <div className={"richtext-field" + (props.isErroneous ? " error" : "")}>
            <div className="richtext-field-controls">
                <button
                    onMouseDown={(e) => handleControlMouseDown(e, RichUtils.toggleInlineStyle(editorState, 'BOLD'))}
                    onClick={(e) => { e.preventDefault() }}>
                    <i className="bi bi-type-bold" />
                </button>
                <button
                    onMouseDown={(e) => handleControlMouseDown(e, RichUtils.toggleBlockType(editorState, 'unordered-list-item'))}
                    onClick={(e) => { e.preventDefault() }}>
                    <i className="bi bi-list-ul" />
                </button>
            </div>
            <div className="richtext-field-input">
                {/* Do not display default text if there is initial content and no change is made */}
                {changeMade && !active && !props.initialContent && empty &&
                    <span className="richtext-default-text">
                        {props.defaultText}
                    </span>
                }
                <ScrollWindow>
                    <Editor editorState={editorState} onChange={onChange} handleKeyCommand={handleKeyCommand} keyBindingFn={keyBindings} />
                </ScrollWindow>
            </div>
        </div>
    )
};

export default RichTextField;
