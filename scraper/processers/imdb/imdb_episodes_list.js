var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API

//getInfo receives an html file and returns null by default
//getInfo recibe el html y devuelve null por defecto
module.exports.getInfo = function(html)
{
	return null;
	
};

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html)
{
	var $ = cheerio.load(html);
	var pageURL = $('link[rel="canonical"]').attr('href');
	links = [];
	
	//episodes list 
	var episodes = $('.info a');
	episodes.each(function(index, elem){
		var url = checkURL(pageURL,episodes.attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "episode"
		 });
	});

	//linkt to next season
	var next_season = $('#load_next_episodes');
	if( next_season.length > 0 ){
		var url = checkURL(pageURL,next_season.attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "episodes_list"
			 
		});	
	}
	

	//linkt to past season
	var previous_season = $('#load_previous_episodes');
	var url = previous_season.attr('href');
	if(url){
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "episodes_list"
		});	
	}
		
	
	return links;
};

var checkURL = function(pageURL,url)
{
	if (url.slice(0,1) == '?'){
		return pageURL+url;
	}
	return "www.imdb.com"+url;
	
};