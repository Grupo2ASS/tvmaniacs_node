var cheerio = require('cheerio');
var tidy_string = require('../tidy_string.js');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {
		var metacritic_id, name, s_name, user_rating, metascore;
		var $ = cheerio.load(html);

		
		
		// ID
		metacritic_id = $('meta[name = "fb:app_id"]').attr("content");		
		//metacritic_id = parseInt(metacritic_id);

		// NAME
		name = $('meta[name="og:title"]').attr("content");
        if( name )
            s_name = tidy_string.tidy(name);

		user_rating = parseFloat($('div[class="metascore_w user large tvshow positive"]').html());

		metascore = $('div[class="metascore_w xlarge tvshow positive"]').html();
		
		return {
			"metacritic_id": metacritic_id,
			"name": name,
            "s_name":s_name,
			"user_rating": user_rating, //(metacritic)
			"metascore": metascore
		}
	};

	var getLinks = function(html) {
		
		
		var $ = cheerio.load(html);
		links = [];
		pageURL = $('link[rel="canonical"]').attr('href');
		

		//reviews
		//guardamos el mismo link de esta serie, pero ahora para que lo scrapee como review
		links.push({

			"url": pageURL,
			"site": "Metacritic",
			"type": "review"
		});

		//ahora una vez para cada season

		//OJOOOO XQ NO ESTAN HECHO LOS PROCESSERS DE SEASONS! DND VA A IR A GUARDAR LAS REVIEWS?

		var seasons = $(".product_data").find(".summary_detail.product_seasons").find(".data").find('a');
		seasons.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
			 	"url" : url,
			 	"site": "Metacritic",
			 	"type": "review"
			 	});
		});

		//guardamos series relacionadas //se podria revisar esto si funciona al 100, parece no pescar ni la primera ni la ultima url
		var related_series = $(".module.products_module.list_product_titles_widget_module.contain_module").find(".body").find(".score_title_row").find(".product_title");
		related_series.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "Metacritic",
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


	module.exports.getInfo = function(html) {
		return getInfo(html);
	};
	module.exports.getLinks = function(html) {
		return getLinks(html);
	};

}());