var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {
		var metacritic_id, name, user_rating, metascore;
		var $ = cheerio.load(html);

		//Obtengo el id del actor del tag con el link a la página 
		//pattern = /\d{7}/;	
		metacritic_id = $('meta[name = "fb:app_id"]').attr("content");		//Busca un numero de exactamente 7 digitos en la url
		//metacritic_id = parseInt(metacritic_id);

		name = $('meta[name="og:title"]').attr("content");
		user_rating = parseFloat($('div[class="metascore_w user large tvshow positive"]').html());
		metascore = $('div[class="metascore_w xlarge tvshow positive"]').html();


		
		return {
			"metacritic_id": metacritic_id,
			"name": name,
			"user_rating": user_rating, //(metacritic)
			"metascore": metascore,
		}
	};

	var getLinks = function(html) {
		
		//AL PARECER NO HAY LINKS INTERESANTES, solo critics y reviews
		links = [];
		return links;
	};

	var checkURL = function(pageURL,url)
	{
		if (url.slice(0,1) == '?'){
			return pageURL+url;
		}
		return "www.metacritic.com"+url;
		
	};


	module.exports.getInfo = function(html) {
		return getInfo(html);
	};
	module.exports.getLinks = function(html) {
		return getLinks(html);
	};

}());