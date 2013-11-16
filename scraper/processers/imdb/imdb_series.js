var cheerio = require('cheerio');
var tidy_string = require('../tidy_string.js');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {
		var imdb_id, name, s_name, user_rating, description, duration, genres, pic, year_start, year_end, cast, seasons;
		var $ = cheerio.load(html);

		// ID
        pattern = /\d{7}/;
		imdb_id = $('link[rel = "canonical"]')

		if( imdb_id.length > 0 ){
			imdb_id = imdb_id.attr("href").match(pattern);
			imdb_id = imdb_id;	
		}

		// NAME
		name = $('span[itemprop="name"]').html();
        if(name != null)
            s_name = tidy_string.tidy(name);

        // USER RATING
		user_rating = parseFloat($('span[itemprop="ratingValue"]').html());

		// DESCRIPTION
		description = $('p[itemprop="description"]').html();
		description = formatAllLinks(description);

		// DURATION
		var unparsed_duration = $('time[itemprop="duration"]').html();
		if( unparsed_duration ){
			unparsed_duration = unparsed_duration.trim().split(' ');	
			duration = parseInt(unparsed_duration[0]);
		}
		

		// GENEROS
		genres = [];
		$('div[itemprop="genre"] a').each(function(index, elem) {
			genres.push($(this).html());
		});

		// PIC
		pic = $('img[itemprop="image"]').attr('src');
        if(pic == undefined)
            pic = '';
        
        // YEARS
		var years = $('.header > .nobr').html();
        if(years){
            years = years.replace('(', '');
            years = years.replace(')', '');
            years = years.replace(' ', '');
            years = years.split('–');
            year_start = years[0];
            if (years.length > 1)
                year_end = years[1];
            else
                year_end = null;
        }

        // cast
		cast = [];
		// $('.cast_list span[itemprop="name"]').each(function(index, elem) {
		// 	cast.push({
		// 		"name": this.html()
		// 	});
		// });
		$( '.cast_list a[itemprop="url"]' ).each( function( index, elem ){
			
			pattern = /\d{7}/;
			var current_cast = this.attr('href').match(pattern);
			current_cast.input="www.imdb.com"+current_cast.input
            cast.push( current_cast );
		});

		// SEASONS
		seasons = [];
		$('#titleTVSeries .see-more.inline').first().children('a').each(function(index, elem) {
			seasons.push({
				"number": this.html()
			});
		});
		seasons = seasons.reverse();

		return {
			"imdb_id": imdb_id,
			"name": name,
            "s_name": s_name,
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
		if (url && url.slice(0,1) == '?'){
			return pageURL+url;
		}
		return "www.imdb.com"+url;
		
	};

	var formatAllLinks = function(text_chain) {
		text_chain_splited = text_chain.split('href="');
		var finalBio = text_chain_splited[0];
		for(var i=1;i<text_chain_splited.length;i++){
			finalBio = finalBio+'href="www.imdb.com'+text_chain_splited[i];
		}

		return finalBio;
	};


	module.exports.getInfo = function(html) {
		return getInfo(html);
	};
	module.exports.getLinks = function(html) {
		return getLinks(html);
	};

}());