import React, { useState } from "react";
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

const ReactEditorJS = createReactEditorJS()

export default function Writer() {

    const [Value, setValue] = useState("")
    const [OldValue, setOldValue] = useState("")

    const editorCore = React.useRef(null)

    const handleInitialize = React.useCallback((instance) => {
      editorCore.current = instance
    }, [])
    
    const handleSave = React.useCallback(async () => {
        const savedData = await editorCore.current.save().then((e) => {
            setValue(e["blocks"])
            console.log(e)
        })
      
    }, [])

    const renderOldContent = async() => {
        const savedData = await editorCore.current.save().then((e) => {
            setValue(e["blocks"])
            console.log(e)
        })
    }

    return (
        <div>
            <ReactEditorJS onInitialize={handleInitialize} defaultValue={Value} tools={EDITOR_JS_TOOLS}/>
            <button onClick={handleSave}>test</button>
            <button className="bg-sky-400" onClick={renderOldContent}>button</button>
        </div>
    )
}