import React, { useState } from "react";
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

const ReactEditorJS = createReactEditorJS()

export default function Writer() {



    const [Value, setValue] = useState("")

    const editorCore = React.useRef(null)

    const handleInitialize = React.useCallback((instance) => {
      editorCore.current = instance
    }, [])
    
    const handleSave = React.useCallback(async () => {
        const savedData = await editorCore.current.save().then((e) => {
            console.log(e["blocks"])
            
        })
      
    }, [])


    return (
        <div>
            <ReactEditorJS onInitialize={handleInitialize} defaultValue={""} tools={EDITOR_JS_TOOLS}/>
            <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md">Save</button>
        </div>
    )
}