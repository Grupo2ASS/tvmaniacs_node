//Cargamos Cheerio para usar jquery con el archivo)
var cheerio = require('cheerio');

//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {
	
	//getIMDBActorInfo recibe el html y devuelve la info del actor en formato JSON
    var getIMDBActorInfo = function(html)
		{
			var name, last_name, score, highest_score, lowest_score, bio, pic, birth_date, birth_place, series;
			var $ = cheerio.load(html);
			
			var complete_name = $('span[itemprop="name"]').html().split(' ');
			first_name = complete_name[0];
			complete_name.splice(0,1);
			last_name = complete_name.join(' ');
			
			var born_info = $('#name-born-info');
			birth_date = $('time', born_info).attr('datetime');
			//1956-12-31
			birth_place = $('a', born_info).last().html();
			
			
			return {
				"first_name": first_name,
				"last_name": last_name,
				"score": score,					//(metacritic)
				"highest_score": highest_score,  				//(metacritic)
				"lowest_score": lowest_score, 				//(metacritic)
				"bio": bio, 
				"pic": pic,						//direccion a un recurso del media server??
				"birth_date": birth_date,
				"birth_place": birth_place,
				"series": series
					/*[
					{
						"name": "House M.D.", 
						"año": 2004
					}
					]*/
			}
		};

    module.exports.getIMDBActorInfo = function(html) {
        return getIMDBActorInfo(html);
    };

}());