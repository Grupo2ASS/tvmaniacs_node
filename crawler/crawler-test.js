var Crawler = require("crawler").Crawler;

var fs = require('fs');

var c = new Crawler({
"maxConnections":10,

// This will be called for each crawled page
"callback":function(error,result,$) {

    //console.log(result.body.toString());

    // $ is a jQuery instance scoped to the server-side DOM of the page
    /* Get all links in page
    $("a").each(function(index, a) {
	var href = a.href;
	if(href != undefined)
	{
    		//console.log(href);
        	c.queue(href);
	}
    });
    */

	// Page source code
    	var page = result.body.toString();
	
	// Create if doesnt exists directory
	var dir_name = "pages", file_name = "page", file_ext = ".html";
	fs.mkdir(dir_name,function(e){
	    if(!e || e.code === 'EEXIST'){
		// Write source code to a file

		var page_number = 1;
		while (fs.existsSync(dir_name+"/"+file_name+page_number+file_ext)) {
			page_number++;
		}

		fs.writeFile(dir_name+"/"+file_name+page_number+file_ext, page, function(err) {
		    if(err) {
			console.log(err);
		    } else {
			console.log("The file was saved!");
		    }
		});
	    } else {
		//debug
		console.log(e);
	    }
	});
	
}
});

// Queue just one URL, with default callback
c.queue("http://google.com");
c.queue("http://azkeet.com");

// Queue a list of URLs
/*c.queue(["http://jamendo.com/","http://tedxparis.com"]);*/

// Queue URLs with custom callbacks & parameters
/*c.queue([{
"uri":"http://parishackers.org/",
"jQuery":false,

// The global callback won't be called
"callback":function(error,result) {
    console.log("Grabbed",result.body.length,"bytes");
}
}]);*/
