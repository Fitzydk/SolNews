import { NextResponse, NextRequest } from 'next/server'
import dbConnect from "../../_mongo/dbConnect"
import Category from "../../models/Category"
import Articles from '../../models/Articles'
import mongoose from 'mongoose'

export default function Handler(req, res) {

    console.log(dbConnect())

    return new Promise(resolve => {
        if (req.method === 'POST') {
            if(req.body == ""){
                try{
                    
                    Category.find({}).then((resp) => {
                        let tags = []
                        for(let i = 0; i < resp.length; i++){
                            tags.push({value: resp[i].category, label: resp[i].category})
                        }
                        tags.sort(function (a, b) {
                            if (a.value < b.value) {
                            return -1;
                            }
                            if (a.value > b.value) {
                            return 1;
                            }
                            return 0;
                        })

                        return res.status("200").json(tags)
                    })
        
                    return res.status("500")
                }
                catch(e){
                    return res.status("200").json(e)
                }
            }
            else if(req.body == "GetCategories"){
                try{
                    Articles.find({}).then((resp) => {
                        let jsonData = []
                        for(var i = 0; i < resp.length; i++){
                            let id = resp[i]["_id"].toString()
                            jsonData.push({"id": id, "tags": resp[i].categories})
                        }
                        return res.status("200").json(jsonData)
                    })
        
                    return res.status("500")
                }
                catch(e){
                    return res.status("200").json(e)
                }
            }
        }
    })

}

/*
                    var id = mongoose.mongo.ObjectId(req.body)
                    Articles.find({ _id: id }).then((resp) => {
                        return res.status("200").json(resp[0].categories)
                    })
*/