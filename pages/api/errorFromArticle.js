import { NextResponse, NextRequest } from 'next/server'
import dbConnect from "../../_mongo/dbConnect"
import Articles from "../../models/Articles"
import mongoose from 'mongoose'

export default function Handler(req, res) {

    dbConnect().then(() => {
        return new Promise(resolve => {
            if (req.method === 'POST') {
                try{
                    let data = req.body
                    var id = mongoose.mongo.ObjectId(data)
                    Articles.deleteOne({ _id: id }).then((e) => {
                        return res.status("200")
                    })
                    return res.status("500")
                }
                catch(e){
                    return res.status("200").json(e)
                }
            }
            else {
                res.redirect("/").end()
            }
        })
    })

}