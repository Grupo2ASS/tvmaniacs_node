var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {
		var reviews
		reviews = [];
		var $ = cheerio.load(html);
		var score, name, institution, comment, date, link, critic;
		

		//Obtengo el id del actor del tag con el link a la página 
		//pattern = /\d{7}/;	
		allreviews = $('div[class = "review_section"]');
		//allreviews = $(div[class = "review_section"]');
		

		//SIN TERMINAR!!!

		
		//console.log(allreviews);
		allreviews.each(function(index, elem){
			//console.log("hola");
			var aux = (this.find("*"));
			//console.log(aux);

			institution=(aux.find("a").html());
			console.log(institution);
			//name=(aux.find("span").html());
			//console.log(name);
		
		});

		return {
			"score": score,
			"name": name,
			"institution": institution, //(metacritic)
			"comment": comment,
			"date": date,
			"link":link,
			"critic":critic,
			//"duration": duration, //minutos
			//"genres": genres,
			//"pic": pic, //Link a recurso del media server??
			//"year_start": year_start,
			//"year_end": year_end, //Puede que sea más fácil sacarlo de metacritic
			//"cast": cast,
			//"seasons": seasons
		}
	};

	var getLinks = function(html) {
		
		//AL PARECER NO HAY LINKS INTERESANTES
		//var $ = cheerio.load(html);
		//var pageURL = $('link[rel="canonical"]').attr('href');
		links = [];
		
		//PERO ESTO NO ES INFO INTERESANTE! COMO PA CRAWLERARLA
		/*
		var critic_reviews = $('#titleTVSeries a');
		seasons.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			 links.push({
			 	"url" : url,
			 	"site": "metacritic",
			 	"type": "critic_reviews"
			 	});
		});


		var user_reviews = $('.infobar a').filter(':has(span[itemprop="genre"])');
		genres.each(function(index, elem){
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
				"site" : "metacritic",
				"type": "user_reviews"
			});
		});

		
		var related_articles = $('.rec-title').filter(':contains("TV Series")').children('a');
		related_series.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "metacritic",
			 	"type": "related_articles"
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
		return "www.imdb.com"+url;
		
	};


	module.exports.getInfo = function(html) {
		return getInfo(html);
	};
	module.exports.getLinks = function(html) {
		return getLinks(html);
	};

}());