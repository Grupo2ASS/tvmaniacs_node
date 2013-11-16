var cheerio = require('cheerio');
var tidy_string = require('../tidy_string.js');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API


	
	//getInfo receives an html file and returns the actor's information in JSON format
	//getInfo recibe el html y devuelve la info del actor en formato JSON
module.exports.getInfo = function(html) {
	var metacritic_id, first_name, last_name, s_name, score, high_score, low_score;
	var $ = cheerio.load(html);
	
	// ID
 	metacritic_id = $('meta[name = "fb:app_id"]').attr("content");//.match(pattern);
	metacritic_id = parseInt(metacritic_id);
	
	// NAME
	var complete_name = $('meta[name="og:title"]').attr("content");

	if( complete_name ){
		complete_name = complete_name.split(" ");
		first_name = complete_name[0];
		last_name = complete_name[1];	

		if( first_name )
        	s_name = tidy_string.tidy(first_name);
    	if( last_name ){
	        s_name += ' ';
	        s_name += tidy_string.tidy(last_name);
    	}
	}
	

	score=$(".review_average").find(".data.textscore.textscore_mixed").text();

	high_score = $(".highest_review").find("span[class^='metascore_w']").text();

	low_score = $(".lowest_review.last").find(".metascore_w.small.movie.negative.indiv").text();
	
	
	return {
		"metacritic_id": metacritic_id,
		"first_name": first_name,
		"last_name": last_name,
        "s_name": s_name,
		"score": score,
		"high_score":high_score,
		"low_score":low_score
	}
};

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html) {
	var $ = cheerio.load(html);
	var pageURL = $('meta[name="og:url"]').attr('content');
	links = [];

	//obtenemos el link a la lista de series en que aparece el actor

	var urlListaSeries =$(".module.credits_module.person_credits_module").find(".tabs.tabs_type_1").find(".tab.tab_type_1.tab_tv.last").find('a').attr('href');
	urlListaSeries="www.metacritic.com"+urlListaSeries;
	links.push({
			"url": urlListaSeries,
			"site": "Metacritic",
			"type": "series_list"
		});


	return links;
};

var checkURL = function(pageURL,url) {
	if (url.slice(0,1) == '?'){
		return pageURL+url;
	}
	return "www.metacritic.com"+url;
	
};
	

// module.exports.getInfo = function(html) {
//     return getInfo(html);
// };
// module.exports.getLinks = function(html) {
//     return getLinks(html);
// };

