import Link from "next/link"
import { useState, useEffect } from "react";
import Router from "next/router";

export default function ArticleCard(props) {
    let articleId = props.articleId
    let walletAdd = props.walletAdd
    let content = props.content
    let articleTags = props.articleTags
    let Tags = articleTags.tags
    
    return(
      <div className="p-6 m-8 rounded-lg shadow-lg bg-white w-auto hover:shadow-black" data-tags={`${Tags}`} data-id={`${articleId}`}>
          <div className="cursor-pointer" onClick={() => {Router.push(`/${walletAdd}/${articleId}`)}}>
            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">{JSON.parse(content)[0]["data"]["text"]}</h5>
            <p className="text-gray-700 text-base mb-4">{JSON.parse(content)[1]["data"]["text"]}</p>
            <div>
              {Tags.map((item, index) => (
                <span key={index} className="px-4 py-2 rounded-full inline text-gray-500 bg-gray-300 font-semibold text-sm align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">{item}</span>
              ))
              }
            </div>
          </div>
          <span onClick={() => {Router.push(`/${walletAdd}/account`)}} className="px-4 py-2 rounded-full mt-3 text-gray-500 block bg-gray-300 font-semibold text-sm align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">{walletAdd}</span>
      </div>
    )
  }