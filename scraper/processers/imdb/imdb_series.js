var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {

		/*{
				"name": "House M.D.",
				"user_rating": 8.3, 			//(metacritic)
				"description": "An antisocial maverick doctor who specializes in diagnostic medicine ...",
				"duration": 45,			//minutos
				"genres":[
					"Drama",
					"Mystery"
				],
				"pic": "", 				//Link a recurso del media server??
				"year_start": 2004,
				"year_end": 2012,				//Puede que sea más fácil sacarlo de metacritic
				"cast":[
					{ "name": "Hugh Laurie"},
					{ "name": "Omar Epps"},
					{ "name": "Robert Sean Leonard"},
					{ "name": "Jesse Spencer"}
				],
				"seasons":[
					{
						"number": 1		
					}
				]
			}*/
		var name, user_rating, description, duration, genres, pic, year_start, year_end, cast, seasons;
		var $ = cheerio.load(html);

		name = $('span[itemprop="name"]').html();
		user_rating = parseFloat($('span[itemprop="ratingValue"]').html());
		description = $('p[itemprop="description"]').html();
		var unparsed_duration = $('time[itemprop="duration"]').html().trim().split(' ');
		duration = parseInt(unparsed_duration[0]);
		genres = [];
		$('div[itemprop="genre"] a').each(function(index, elem) {
			genres.push($(this).html());
		});
		pic = $('img[itemprop="image"]').attr('src');
		var years = $('.header > .nobr').html();
		years = years.replace('(', '');
		years = years.replace(')', '');
		years = years.replace(' ', '');
		years = years.split('–');
		year_start = years[0];
		if (years.length > 1)
			year_end = years[1];
		else
			year_end = null;
		cast = [];
		$('.cast_list span[itemprop="name"]').each(function(index, elem) {
			cast.push({
				"name": this.html()
			});
		});
		seasons = [];
		$('#titleTVSeries .see-more.inline').first().children('a').each(function(index, elem) {
			seasons.push({
				"number": this.html()
			});
		});

		return {
			"name": name,
			"user_rating": user_rating, //(metacritic)
			"description": description,
			"duration": duration, //minutos
			"genres": genres,
			"pic": pic, //Link a recurso del media server??
			"year_start": year_start,
			"year_end": year_end, //Puede que sea más fácil sacarlo de metacritic
			"cast": cast,
			"seasons": seasons
		}
	};

	var getLinks = function(html) {
		var $ = cheerio.load(html);
		var pageURL = $('link[rel="canonical"]').attr('href');
		links = [];
		
		var genres = $('.infobar a').filter(':has(span[itemprop="genre"])');
		genres.each(function(index, elem){
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
				"site" : "IMDB",
				"type": "series_list"
			});
		});

		var seasons = $('#titleTVSeries a');
		seasons.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			 links.push({
			 	"url" : url,
			 	"site": "IMDB",
			 	"type": "episodes_list"
			 	});
		});

		var related_series = $('.rec-title').filter(':contains("TV Series")').children('a');
		related_series.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "IMDB",
			 	"type": "series"
			});
		});

		var actors = $('.cast_list td[itemprop="actor"] a');
		actors.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "IMDB",
			 	"type": "actor"
			});
		});

		var full_cast = $('#titleCast .see-more a');
		var url = checkURL(pageURL,full_cast.attr('href'));
		links.push({
			"url" : url,
			"site": "IMDB",
			"type": "actors_list"
		});

		var keywords = $('div[itemprop="keywords"] > a');
		keywords.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "IMDB",
			 	"type": "series_list"
			});
		});

		var country = $('#titleDetails > .txt-block').filter(':contains("Country")').children('a');
		country.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "IMDB",
			 	"type": "series_list"
			});
		});

		var language = $('#titleDetails > .txt-block').filter(':contains("Language")').children('a');
		language.each(function(index, val) {
			var url = checkURL(pageURL,$(this).attr('href'));
			links.push({
				"url" : url,
			 	"site": "IMDB",
			 	"type": "series_list"
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