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
	

	score=$(".review_average").find(".data.textscore.textscore_mixed").text();
	high_score = $(".highest_review").find("span[class^='metascore_w']").text();
	low_score = $(".lowest_review.last").find(".metascore_w.small.movie.negative.indiv").text();
	
	
	return {
		"metacritic_id": metacritic_id,
		"first_name": first_name,
		"last_name": last_name,
		"score": score,
		"high_score":high_score,
		"low_score":low_score,
	}
};

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html) {
	var $ = cheerio.load(html);
	var pageURL = $('meta[name="og:url"]').attr('content');
	links = [];
	
	
	//ACA HAY UN PROBLEMA NO RESUELTO. POR DEFECTO, LA PAGINA DE UN ACTOR EN METACRITIC NOS MUESTRA LAS PELICULAS EN LAS
	//QUE HA PARTICIPADO.. NECESITAMOS LAS SERIES.. ERgO HAY QUE HACER CLICK EN SERIES Y LUEGO BUSCAR LOS LINKS EN ESA PAGINA, NO ENL LA ACTUAL!
	//RESCATAR EL HTML DE LA SECCION 'TV' ES PEGA DEL CRAWLER!



	var filmo= $('table[class="credits person_credits"]').find("tbody").find("tr").find('td[class="title brief_metascore"]').find('a');


	

	//AQUI LE PONEMOS EL LINK A LAS SERIES
	filmo.each(function(index, elem){
		var url = checkURL(pageURL,$(this).attr('href'));
		links.push({
			"url": url,
			"site": "Metacritic",
			"type": "series"
		});

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

