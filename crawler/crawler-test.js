var Crawler = require("crawler").Crawler;

var fs = require('fs');

var c = new Crawler({
"maxConnections":10,

// This will be called for each crawled page
"callback":function(error,result,$) {

	// Get links in page (scrapper work)
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

	var website_name = "other";
	var dir_name = "other"; 
	// Check if the site es imdb
	if (($('meta[property="og:site_name"]').attr('content') != undefined && $('meta[property="og:site_name"]').attr('content').toString().toLowerCase() == "imdb") || ($("title") != undefined && $("title").text().toLowerCase().indexOf("imdb") >= 0))
	{
		console.log("IMDB");
		website_name = "imdb";
		var page_type = $('meta[property="og:type"]').attr('content');
		if (page_type != undefined)
		{
			switch(page_type.toString())
			{
				case "video.tv_show":
				  if ($('meta[name="keywords"]').attr('content') != undefined && $('meta[name="keywords"]').attr('content').toString().toLowerCase() == "episodes")
				  {
				  	dir_name = "episodes_lists";
				  }
				  else
				  {
				  	dir_name = "series";
				  }
				  break;
				case "actor":
				  dir_name = "actors";
				  break;
				case "video.episode":
				  dir_name = "episodes";
				  break;
				default:
				  dir_name = "other";
			}
		}
		else if ($('meta[property="og:title"]').attr('content') != undefined && $('meta[property="og:title"]').attr('content').toString().toLowerCase().indexOf("episodes cast") >= 0)
		{
			dir_name = "actors_lists";
		}
	}
	// Check if the site is metacritic
	else if ($('meta[name="application-name"]').attr('content') != undefined && $('meta[name="application-name"]').attr('content').toString().toLowerCase() == "metacritic" || ($("title") != undefined && $("title").text().toLowerCase().indexOf("metacritic") >= 0))
	{
		console.log("METACRITIC");
		website_name = "metacritic";
		var page_type = $('meta[name="og:type"]').attr('content');
		if (page_type != undefined)
		{
			switch(page_type.toString())
			{
				case "tv_show":
				  dir_name = "series";
				  break;
				case "public_figure":
				  dir_name = "actors";
				  break;
				default:
				  dir_name = "other";
			}
		}
		else if ($("title") != undefined && $("title").text().toLowerCase().indexOf("tv shows") >= 0)
		{
			dir_name = "series_lists";
		}
	}
	// If the site is not imdb or metacritic
	else
	{
		console.log("OTHER");
	}


	// Get page source code
    	var page = result.body.toString();
	
	// Create website directory if doesnt exists
	var file_name = "page", file_ext = ".html";
	fs.mkdir(website_name,function(e){
	    if(!e || e.code === 'EEXIST'){
		
		// Inside website directory create type directory if doesnt exists
		fs.mkdir(website_name+"/"+dir_name,function(f){
		    if(!f || f.code === 'EEXIST'){

			// Check if name already exists and add to counter
			var page_number = 1;
			while (fs.existsSync(website_name+"/"+dir_name+"/"+file_name+page_number+file_ext)) {
				page_number++;
			}
			// Write page source code to a file
			fs.writeFile(website_name+"/"+dir_name+"/"+file_name+page_number+file_ext, page, function(err) {
			    if(err) {
				console.log(err);
			    } else {
				console.log("The file was saved!");
			    }
			});
		    } else {
			//debug
			console.log(f);
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
/*c.queue("http://www.imdb.com/title/tt0944947/");
c.queue("http://www.metacritic.com/tv/mad-men");
c.queue("http://www.metacritic.com/feature/breaking-bad-series-finale-reviews-felina");
c.queue("http://www.metacritic.com/person/vincent-kartheiser?filter-options=tv");
c.queue("http://www.imdb.com/name/nm0372176/?ref_=tt_cl_t2");
c.queue("http://www.google.com");*/
c.queue("http://www.imdb.com/title/tt0903747/epcast?ref_=ttep_ql_2");
c.queue("http://www.imdb.com/title/tt0903747/episodes");
c.queue("http://www.imdb.com/gender/male");
c.queue("http://www.metacritic.com/browse/tv/release-date/returning-series/name?view=condensed");

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
