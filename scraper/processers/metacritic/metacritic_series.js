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


		//NO VA LA BIOGRAFIA
		//description = $('span[itemprop="description"]').html();
		
		//NO VA LA DURACION
		//OBTENIENDO DURACION, PENDIETE! MIRAR LINEA 933 DEL html
		//$('li[class="summary_detail product_runtime"]')).children().filter()
		
		//NO VA EL GENERO
		//var unparsed_duration = $('time[itemprop="duration"]').html().trim().split(' ');
		//duration = parseInt(unparsed_duration[0]);
		//genres = [];
		//$('span[itemmprop="genre"]').each(function(index, elem) {
		//	genres.push($(this).html());
		//});
		
		//NO VA La foto
		//pic = $('img[class="product_image large_image"]').attr('src');
		
		//no hay info de years
		//var years = $('.header > .nobr').html();
		//years = years.replace('(', '');
		//years = years.replace(')', '');
		//years = years.replace(' ', '');
		//years = years.split('–');
		//year_start = years[0];
		/*
		if (years.length > 1)
			year_end = years[1];
		else
			year_end = null;
		cast = [];
		// $('.cast_list span[itemprop="name"]').each(function(index, elem) {
		// 	cast.push({
		// 		"name": this.html()
		// 	});
		// });
		$( '.cast_list a[itemprop="url"]' ).each( function( index, elem ){
			
			pattern = /\d{7}/;
			cast.push( parseInt( this.attr('href').match(pattern) ) );
		});
		*/

		//NO VAN LAS SEASONS
		/*
		seasons = [];
		$('#titleTVSeries .see-more.inline').first().children('a').each(function(index, elem) {
			seasons.push({
				"number": this.html()
			});
		});
		seasons = seasons.reverse();
		*/
		return {
			"metacritic_id": metacritic_id,
			"name": name,
			"user_rating": user_rating, //(metacritic)
			"metascore": metascore,
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