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
		//score es number
		//critic es True si la review es de un critico. False si es de una persona corriente


		//obtenemos todas las reviews	
		var allreviews = $('ol[class = "reviews critic_reviews"]').find('div[class="review_content"]');

		allreviews.each(function(index, elem){
			
			//agggggg arreglar esto!
			
			//ESTO (OBTENER LA INFO DE CADA REVIEW) NO ESTA FUNCIONANDO! 
			institution = $(this).find(".review_section").find(".review_stats").find(".review_critic has_author").find(".source");	
			console.log(institution);
			//	score=$(".review_average").find(".data.textscore.textscore_mixed").text();

			//score = allreviews.find("div.metascore_w medium tvshow positive indiv");

			
		//	score = $(this).find('div[class="metascore_w medium tvshow positive indiv"]').text();
			//console.log(score);
			console.log(index);


			//DEBEMOS GUARDAR LA INFO OBTENIDA COMO UNA REVIEW EN reviews[];
		});


		return {
			//que retornamos? el arreglo de todos los reviews supongo...
			"score": score,
			"name": name,
			"institution": institution, //(metacritic)
			"comment": comment,
			"date": date,
			"link":link,
			"critic":critic,
		}
	};

	var getLinks = function(html) {
		
		//AL PARECER NO HAY LINKS INTERESANTES
		//var $ = cheerio.load(html);
		//var pageURL = $('link[rel="canonical"]').attr('href');
		links = [];
		

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