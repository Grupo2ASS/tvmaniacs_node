var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API


//getInfo receives an html file and returns null by default
//getInfo recibe el html y devuelve null por defecto
module.exports.getInfo = function(html){
	return null;	
};
	

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html){
	var $ = cheerio.load(html);
	var pageURL = $('link[rel="canonical"]').attr('href');
	links = [];
	
	//actors list 
	var actors = $('.results .name a');
	actors.each(function(index, elem){
		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "actor"
		 });
	});

	//linkt to next page
	var next_page = $('#right .pagination a');
	next_page.each(function(index, elem){
		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "actors_list"
		});
	});
	

	/*
		{
			"url":"http://...",
			"site": "IMDB"/"Metacritic",
			"type": "actor" / "series" / "episode" / "episodes_list" / "actors_list"
		}
	*/
	return links;
};

var checkURL = function(pageURL,url)
{
	if (url.slice(0,1) == '?'){
		return pageURL+url;
	}
	return "www.imdb.com"+url;
	
};
