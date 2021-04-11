import { ContentState, convertFromRaw, convertToRaw, Editor, EditorState, getDefaultKeyBinding, KeyBindingUtil, Modifier, RichUtils, SelectionState } from 'draft-js';
import React, { FunctionComponent, useState } from 'react';

import ScrollWindow from './ScrollWindow';

interface Props {
    initialContent: string
    defaultText: string
    onChange: (content : string) => void
    isErroneous: boolean
}

const RichTextField: FunctionComponent<Props> = (props: Props) => {
    const [active, setActive] = React.useState(false) // whether we have entered any content beyond the default text
    const [editorState, setEditorState] = React.useState(
        props.initialContent ?
        EditorState.createWithContent(convertFromRaw(JSON.parse(props.initialContent))) :
        EditorState.createWithContent(ContentState.createFromText(props.defaultText)))

    const { hasCommandModifier } = KeyBindingUtil;
    function keyBindings(e : React.KeyboardEvent): string | null {
        const selection = editorState.getSelection()
        const block = editorState.getCurrentContent().getBlockForKey(selection.getAnchorKey())
    
        if (e.key === "b" && hasCommandModifier(e)) {
            return 'bold'
        }
    
        if (e.key === " " && selection.getAnchorOffset() === 1 && block.getText().trim().charAt(0) === "-" && block.getType() !== 'unordered-list-item') {
            return 'make-list'
        }
    
        if (e.key === "Backspace" && block.getType() !== 'unstyled' && block.getText().length === 0) {
            return 'remove-block-styling'
        }
        
        return getDefaultKeyBinding(e)
    }

    function clearState(currentState: EditorState) {
        const blocks = currentState.getCurrentContent().getBlockMap().toList()
        const allSelection = editorState.getSelection().merge({
            anchorKey: blocks.first().get('key'),
            anchorOffset: 0,
            focusKey: blocks.last().get('key'),
            focusOffset: blocks.last().getLength(),
        })
        const newContent = Modifier.removeRange(editorState.getCurrentContent(), allSelection, 'backward')

        const clearedState = EditorState.push(currentState, newContent, 'remove-range')
        setEditorState(EditorState.forceSelection(clearedState, newContent.getSelectionAfter()))
    }

    function onChange(state: EditorState) {
        // check if we started with defaultText, if so clear state
        if (!active && !props.initialContent) { 
            clearState(state)
            setActive(true)
            return
        }

        // check if we are already typing (we are active) and state has no text
        if (active && !state.getCurrentContent().hasText()) {
            props.onChange(JSON.stringify(convertToRaw(state.getCurrentContent())));
            setEditorState(EditorState.createWithContent(ContentState.createFromText(props.defaultText)))
            setActive(false)
            return
        }

        props.onChange(JSON.stringify(convertToRaw(state.getCurrentContent())));
        setEditorState(state);
    }

    function handleKeyCommand(command : string, state : EditorState ) {
        const selection = state.getSelection()
        const block = editorState.getCurrentContent().getBlockForKey(selection.getAnchorKey())

        if (command === 'bold') {
            onChange(RichUtils.toggleInlineStyle(state, 'BOLD'))
            return 'handled'
        } 
        
        if (command === 'make-list') {
            let modifiedContent = state.getCurrentContent()

            if (block.getText().trim().charAt(0) === "-") {
                const replacementRange = new SelectionState({
                    anchorKey: selection.getAnchorKey(),
                    anchorOffset: 0,
                    focusKey: selection.getFocusKey(),
                    focusOffset: 1
                })

                modifiedContent = Modifier.replaceText(state.getCurrentContent(), replacementRange, "")
            }
            
            const modifiedState = RichUtils.toggleBlockType(EditorState.push(state, modifiedContent, 'delete-character'), 'unordered-list-item')

            const newSelection = new SelectionState({
                anchorKey: modifiedState.getSelection().getAnchorKey(),
                anchorOffset: 0,
                focusKey: modifiedState.getSelection().getAnchorKey(),
                focusOffset: 0
            })

            onChange(EditorState.forceSelection(modifiedState, newSelection))
            return 'handled'
        }

        if (command === 'remove-block-styling') {
            onChange(RichUtils.toggleBlockType(state, 'unstyled'))
            return 'handled'
        }
  
        return 'not-handled'
    }

    function handleControlMouseDown(e : React.MouseEvent<HTMLElement>, modifiedState : EditorState) {
        e.preventDefault()
        
        const nextEditorState = EditorState.acceptSelection(
            modifiedState,
            modifiedState.getSelection().merge({
                hasFocus: true
            })
        );
        onChange(modifiedState)
    }

    return (
        <div className={"richtext-field" + (!active ? " default" : "") + (props.isErroneous ? " error" : "")}>
            <div className="richtext-field-controls">
                <button onMouseDown={(e) => handleControlMouseDown(e, RichUtils.toggleInlineStyle(editorState, 'BOLD'))}>
                    <i className="bi bi-type-bold"/>
                </button>
                <button onMouseDown={(e) => handleControlMouseDown(e, RichUtils.toggleBlockType(editorState, 'unordered-list-item'))}>
                    <i className="bi bi-list-ul"/>
                </button>
            </div>
            <div className="richtext-field-input">
                <ScrollWindow>
                    <Editor editorState={editorState} onChange={onChange} handleKeyCommand={handleKeyCommand} keyBindingFn={keyBindings}/>
                </ScrollWindow>
            </div>
        </div>
    )
};

export default RichTextField;
