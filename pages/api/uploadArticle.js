import { NextResponse, NextRequest } from 'next/server'
import dbConnect from "../../_mongo/dbConnect"
import Articles from "../../models/Articles"

export default function Handler(req, res) {

    dbConnect().then(() => {
        return new Promise(resolve => {
            if (req.method === 'POST') {
                try{
                    let data = JSON.parse(req.body)
                    for(var i = 0; i < data.content.length; i++){
                        if(data.content[i].type == "image"){
                            let tempUrlFile = data.content[i].data.url
                            delete data.content[i].data.url
                            data.content[i].data.file = {url: tempUrlFile}
                        }
                    }
                    var n = new Articles();
                    n.address = data["wallet"]
                    n.categories = data["tags"]
                    n.save(function(err, article) {
                       return res.status("201").json({id: article["_id"], content: data["content"]})
                    })
                }
                catch(e){
                    return res.status("201").json(e)
                }
            }
            else {
                res.redirect("/").end()
            }
        })
    })
}