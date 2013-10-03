
var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function () {

    var getInfo = function (html) {
			
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
						"number": 1,
						"year": 2004  
					}
				]
			}*/
        var name, user_rating, description, duration, genres, pic, year_start, year_end, cast, seasons;
        var $ = cheerio.load(html);
				
				name = $('span[itemprop="name"]').html();
				user_rating = parseFloat($('span[itemprop="ratingValue"]').html());
				description = $('p[itemprop="description"]').html();
				var unparsed_duration = $('time[itemprop="duration"]').html().split(' ');
				duration = parseInt(unparsed_duration[0]);
				genres = []; 
				$('div[itemprop="description"] a').each(function(index, elem){
					genres.push($(this).html());
				});


        return {
					"name": name,
					"user_rating": user_rating, 			//(metacritic)
					"description": description,
					"duration": duration,			//minutos
					"genres":genres ,
					"pic": pic, 				//Link a recurso del media server??
					"year_start": year_start,
					"year_end": year_end,				//Puede que sea más fácil sacarlo de metacritic
					"cast": cast,
					"seasons": seasons
          
            /*[
					{
						"name": "House M.D.", 
						"year": 2004
					}
					]*/
        }
    };

    var getLinks = function (html) {
        var $ = cheerio.load(html);
        links = [];

        /*
				{
					"url":"http://...",
					"site": "IMDB"/"Metacritic",
					"type": "actor" / "series" / "episode" / "episodes_list" / "actors_list"
				}
			*/
        return links;
    };


    module.exports.getInfo = function (html) {
        return getInfo(html);
    };
    module.exports.getLinks = function (html) {
        return getLinks(html);
    };

}());