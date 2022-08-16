
export default function handler(req, res) {
    function parseHtmlEnteties(str) {
        return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
            var num = parseInt(numStr, 10); // read num as normal number
            return String.fromCharCode(num);
        });
    }
    if (req.method === 'GET') {
        
        if(req.body["url"]){
            fetch(req.body["url"]).then(function (response){
                return res.status(200).json({ success: 1, file:{url:req.body["url"]}})
            })
        }
        else if(req.query["url"]){
            fetch(req.query["url"]).then(function (response){
                return response.text()
            }).then(function (html) {
                let title = html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
                title = parseHtmlEnteties(title)
                return res.status(200).json({ success: 1, meta:{title: title, description: "", image:{url: ""}}})   
            })
        }
    }
    else{
        return res.redirect("/")
    }

}