var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {

		/*	chapters:[
		{
			name: "Pilot",
			description: "Young kindergarten teacher Rebecca Adler collapses..."
			rating: 8.6			//IMDB

		}*/
		var name, user_rating, description, series, season;
		var $ = cheerio.load(html);

		name = $('span[itemprop="name"]').html();
		user_rating = parseFloat($('span[itemprop="ratingValue"]').html());
		description = $('p[itemprop="description"]').html();
		series = $(".tv_header a").html()
		var season_episode = $(".nobr").html().split(',');
		season = season_episode[0];

		return {
			"series": series,
			"season": season,
			"name": name,
			"user_rating": user_rating, //(metacritic)
			"description": description
		}
	};

	var getLinks = function(html) {
		var $ = cheerio.load(html);
		links = [];
		
		var genres = $('.infobar a').filter(':has(span[itemprop="genre"])');
		genres.each(function(index, elem){
			links.push({
				"url" : $(this).attr('href'),
				"site" : "IMDB",
				"type": "series_list"
			});
		});

		var seasons = $('#titleTVSeries a');
		seasons.each(function(index, val) {
			 links.push({
			 	"url" : $(this).attr('href'),
			 	"site": "IMDB",
			 	"type": "episodes_list"
			 	});
		});

		var related_series = $('.rec-title').filter(':contains("TV Series")').children('a');
		related_series.each(function(index, val) {
			links.push({
				"url" : $(this).attr('href'),
			 	"site": "IMDB",
			 	"type": "series"
			});
		});

		var actors = $('.cast_list td[itemprop="actor"] a');
		actors.each(function(index, val) {
			links.push({
				"url" : $(this).attr('href'),
			 	"site": "IMDB",
			 	"type": "actor"
			});
		});

		var full_cast = $('#titleCast .see-more a');
		links.push({
			"url" : full_cast.attr('href'),
			"site": "IMDB",
			"type": "actors_list"
		});

		var keywords = $('div[itemprop="keywords"] > a');
		keywords.each(function(index, val) {
			links.push({
				"url" : $(this).attr('href'),
			 	"site": "IMDB",
			 	"type": "series_list"
			});
		});

		var country = $('#titleDetails > .txt-block').filter(':contains("Country")').children('a');
		country.each(function(index, val) {
			links.push({
				"url" : $(this).attr('href'),
			 	"site": "IMDB",
			 	"type": "series_list"
			});
		});

		var language = $('#titleDetails > .txt-block').filter(':contains("Language")').children('a');
		language.each(function(index, val) {
			links.push({
				"url" : $(this).attr('href'),
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


	module.exports.getInfo = function(html) {
		return getInfo(html);
	};
	module.exports.getLinks = function(html) {
		return getLinks(html);
	};

}());