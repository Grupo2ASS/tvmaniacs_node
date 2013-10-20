var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API

	
	//getInfo receives an html file and returns the actor's information in JSON format
	//getInfo recibe el html y devuelve la info del actor en formato JSON
module.exports.getInfo = function(html) {
	var metacritic_id, first_name, last_name, score, high_score, low_score;
	var $ = cheerio.load(html);

	//Obtengo el id del actor del tag con el link a la página 
	//pattern = /\d{7}/; 
 	metacritic_id = $('meta[name = "fb:app_id"]').attr("content");//.match(pattern);
	metacritic_id = parseInt(metacritic_id);
	
	var complete_name = $('meta[name="og:title"]').attr("content");
	complete_name = complete_name.split(" ");
	first_name = complete_name[0];
	last_name = complete_name[1];
	
	
	
	score = $('span[class = "data textscore textscore_favorable"]').first().text();
	high_score = $('span[class = "metascore_w small movie positive review"]').text();
	low_score = $('span[class = "metascore_w small movie mixed review"]').text();

	
	//NO VA LA INFO DE NACIMIENTO
	//LA INFO DE NACIMIENTO NO ESTA SEPARADA, ESTA METIDA DENTRO DEL PARRADO
	//var born_info = $('#name-born-info');
	//birth_date = $('time', born_info).attr('datetime');
	//1956-12-31
	//birth_place = $('a', born_info).last().html();
	
	//NO VA LA BIO
	//bio = $('meta[name="og:description"]').attr("content");
	
	//NO VA LA FOTO
	//pic = $('#name-poster').attr('src');
	
	//NO VAN LAS SERIES
	//guardamos series linkeadas
	//OJO, ESTA ELIGIENDO
	//UNAS QUE no nos sirven, TIENEN CM PADRE<div class="module list_trailers">
	//var filmo = $("a[href^='/movie/']");
	//series = new Array(filmo.length);

	//AQUI LE PONEMOS EL LINK A LAS SERIES
	/*
	filmo.each(function(index, elem){
		
		series[index] = $(this).attr('href');
		console.log(series[index]);

	});
	*/
	//Obtenemos el id de las series en las que actuado el actor
	/*filmo.each(function(index, elem){
		// series[index] = {};
		// series[index]["name"] = $(this).find('a').first().html();
		// var year = $(this).find('.year_column').html().split(';');
		// series[index]["year"] = year[1];

		pattern = /\d{7}/;
		series[index] = parseInt($(this).find('a').attr('href').match(pattern));
	});

*/
	
	
	return {
		"metacritic_id": metacritic_id,
		"first_name": first_name,
		"last_name": last_name,
		"score": score,
		"high_score":high_score,
		"low_score":low_score,
		//"bio": bio, 
		//"pic": pic,						//direccion a un recurso del media server??
		//"birth_date": birth_date,
		//"birth_place": birth_place,
		//"series": series
			/*[
			{
				"name": "House M.D.", 
				"year": 2004
			}
			]*/
	}
};

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html) {
	var $ = cheerio.load(html);
	var pageURL = $('meta[name="og:url"]').attr('content');
	links = [];
	
	//actors list from birth date links (monthday and year)
	//var birth_date = $('#name-born-info time a');
	//birth_date.each(function(index, elem){
	//	var url = checkURL(pageURL,this.attr('href'));
	//	links.push({
	//		"url": url,
	//		"site": "IMDB",
	//		"type": "actors_list"
	//	 });
	//});
	

	//obtenemos los links de las peliculas
	var filmo = $("a[href^='/movie/']");
	series = new Array(filmo.length);

	//AQUI LE PONEMOS EL LINK A LAS SERIES
	filmo.each(function(index, elem){
		var url = checkURL(pageURL,$(this).attr('href'));
		links.push({
			"url": url,
			"site": "Metacritic",
			"type": "series"
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

