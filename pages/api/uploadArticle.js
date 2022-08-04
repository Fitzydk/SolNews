import { NextResponse, NextRequest } from 'next/server'
//import clientPromise from './_mongo/clientPromise'

export default function Handler(req, res) {
    if (req.method === 'POST') {
        console.log(req)
      } else {
        console.log(req["rawHeaders"][1])
        //return NextResponse.redirect('/')
      }
    

}