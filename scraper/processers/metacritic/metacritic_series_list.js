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
	var pageURL ="www.metacritic.com";//$('link[rel="canonical"]').attr('href');
	//console.log(pageURL);
	links = [];
	
	//series list 
	var series = $(".credits.person_credits").find(".title.brief_metascore").find('a');
	series.each(function(index, elem){
		var url = $(this).attr('href');
		url=pageURL+url;
		links.push({
			"url": url,
			"site": "metacritic",
			"type": "series"
		 });
	});

	return links;
};

var checkURL = function(pageURL,url)
{
	if (url.slice(0,1) == '?'){
		return pageURL+url;
	}
	return "www.metacritic.com"+url;

};


