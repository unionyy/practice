var Crawler = require("crawler");
 
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            let ulList = [];
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
            const $bodyList = $("#NM_NEWSSTAND_DEFAULT_THUMB div._NM_UI_PAGE_CONTAINER div div.tile_view div.thumb_area").children("div.thumb_box");
            console.log($bodyList.length)
            $bodyList.each(function(i, elem) {
                ulList[i] = {
                    image_url: $(this).find('a.thumb img').attr('src'),
                    image_alt: $(this).find('a.thumb img').attr('alt')
                };
              });

            const data = ulList.filter(n => n.image_alt);
            console.log(data);
        }
        done();
    }
});
 
// Queue just one URL, with default callback
c.queue('http://www.naver.com');
