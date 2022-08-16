import React, { useEffect, useState } from "react";
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

import { Program } from '@project-serum/anchor';

import Select from "react-select"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactEditorJS = createReactEditorJS()

export default function Writer(props) {

    let provider = props.provider
    let programID = props.programID
    let idl = props.idl
    let baseAccount = props.baseAccount
    let walletAdd = props.walletAddress

    async function sendArticle(walletAdd, content, articleId) {
        let pending = toast.loading("Sending To Blockchain Now!")
        try {
          const program = new Program(idl, programID, provider);
          let test = await program.rpc.addArticle(walletAdd, JSON.stringify(content), articleId, {
            accounts: {
              baseAccount: baseAccount.publicKey,
              user: provider.wallet.publicKey,
            },
          });
          toast.update(pending, { render: "Success, Sent To Blockchain!", type: "success", isLoading: false, autoClose: 5000, closeButton: true })
      
        } catch (error) {
            console.log("Article error", error)
            if(error instanceof RangeError){
                toast.update(pending, { render: "Error, your article is too long to add onto the blockchain!", type: "warning", isLoading: false, autoClose: 5000, closeButton: true })
            }
            else{
                toast.update(pending, { render: "Unsuccessful, Please Try Again!", type: "error", isLoading: false, autoClose: 5000, closeButton: true })
            }
            fetch('../../api/errorFromArticle', {
                method: "POST",
                body: articleId
            }).then((resp) => {
                return resp
            })
        }
    }



    const [Value, setValue] = useState("")
    const [Tags, setTags] = useState([])
    const [UserTags, setUserTags] = useState([])

    const editorCore = React.useRef(null)

    const handleInitialize = React.useCallback((instance) => {
      editorCore.current = instance
    }, [])
    
    const handleSave = async () => {
        const savedData = await editorCore.current.save().then((e) => {
            return e["blocks"]
        }).then((data) => {
            
            let jsonObjectPost = `{
                "wallet": "${walletAdd}",
                "tags": ${JSON.stringify(UserTags)},
                "content": ${JSON.stringify(data)}
            }`
            
            jsonObjectPost = JSON.parse(jsonObjectPost)
            
            let apiPost = fetch('../../api/uploadArticle', {
                method: "POST",
                body: JSON.stringify(jsonObjectPost),
            })
            return apiPost
        }).then((response) => {
            if(response.status === 201){
                toast.success("Successfully Uploaded To Database!");
                return response.text()
            }
            else{
                toast.error("Unsuccessful, Couldnt Upload To Database!");
                throw new Error("Couldnt Upload to Database")
            }
        }).then((content) => {
            let body = JSON.parse(content)
            sendArticle(walletAdd, body["content"], body["id"])
        })
    }


    useEffect(() => {
        fetch('../../api/getCategories', {
            method: "POST",
            body: "",
        }).then((resp) => {
            return resp.json()
        }).then((data) => {
            setTags(data)
        })
    }, [])

    function handleChange(items){
        const selectedTags = items.map((tag) => {
            return tag.value
        })
        setUserTags(selectedTags)
    }
    
    return (
        <div>
            <ReactEditorJS onInitialize={handleInitialize} defaultValue={""} tools={EDITOR_JS_TOOLS} data={{time: 0,blocks: [{type: "header",data: {text: "Title",level: 2}},{ type: "paragraph",data: {text: "Description",}},{ type: "delimiter",data: {}}]}}/>
            <h3 style={{marginBottom: "10px"}}>Tags</h3>
            <Select
                isMulti={true}
                options={Tags}
                onChange={(element) => handleChange(element)}
            />
            <br></br>
            <br></br>
            <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md">Save</button>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}