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
	var pageURL = $('link[rel="next"]').attr('href');
	pageURL="www.metacritic.com"+pageURL;
	//console.log(pageURL);
	links = [];
	

	//<a href="/person/jack-martin">Jack Martin</a>
	//actors list 
	var actors = $('a[href^="/person/"]');
	//console.log(actors);
	
	
	actors.each(function(index, elem){
		

		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "metacritic",
			"type": "actor"
		 });
	});
	
	//linkt to next page
	var next_page = $('a[class="page_num"]');//.attr("href");//text("next");
	
	next_page.each(function(index, elem){
		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "metactiric",
			"type": "actors_list"
		});
	});



/*
	next_page.each(function(index, elem){
		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "metacritis",
			"type": "actors_list"
		});
	});
	
*/
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
	return "www.metacritic.com"+url;
	
};
