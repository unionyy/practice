var Crawler = require("crawler");
 
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());

            const $bodyList = $("div.thumb_area").children("div.thumb_box");
            
            let newsList = [];
            $bodyList.each(function(i, elem) {
                newsList[i] = $(this).find('a.thumb img').attr('alt');
              });

            console.log(newsList);
        }
        done();
    }
});
 
// Queue just one URL, with default callback
c.queue('http://www.naver.com');
