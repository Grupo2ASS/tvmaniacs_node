var cheerio = require('cheerio');
var tidy_string = require('../tidy_string.js');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API


	
	//getInfo receives an html file and returns the actor's information in JSON format
	//getInfo recibe el html y devuelve la info del actor en formato JSON
module.exports.getInfo = function(html) {
	var imdb_id, first_name, last_name, s_name, bio, pic, birth_date, birth_place, series;
	var $ = cheerio.load(html);

	// ID
    pattern = /\d{7}/;
	imdb_id = $('link[rel = "canonical"]');

	if( imdb_id.length > 0 ){
		imdb_id = imdb_id.attr("href").match(pattern);			//Busca nm seguido por 7 digitos
		imdb_id = imdb_id;	
	}
	

	// NAME
	var complete_name = $('span[itemprop="name"]').html();

	if( complete_name ){
		complete_name = complete_name.split(' ');
		first_name = complete_name[0];
		complete_name.splice(0,1);
		last_name = complete_name.join(' ');	
	}

    if( first_name != null)
        s_name = tidy_string.tidy(first_name);
    if( last_name != null){
        s_name += ' ';
        s_name += tidy_string.tidy(last_name);
    }


    // BIRTHINFO
	var born_info = $('#name-born-info');
	birth_date = $('time', born_info).attr('datetime');
    if(birth_date == undefined){
        birth_date = new Date();
    }
	//1956-12-31
	birth_place = $('a', born_info).last().html();
	
	var biobio;
	// BIOGRAPHY
	bio = $('.inline[itemprop="description"]').html();
	bio = formatAllLinks(bio);
    if(bio == undefined)
        bio = '';

    // PICTURE
	pic = $('#name-poster').attr('src');
    if(pic == undefined)
        pic = '';
	
	//solo filmografia como actor, por eso el first()
	//***edit: No siempre es el first, pero si es el next en que data-category = 'actor'
	//var filmo = $("#filmography").children("[data-category='actor']").next().children().filter(":contains('(TV Series)')");
	var filmo = $(".filmo-category-section").first().children().filter(":contains('(TV Series)')");
	series = new Array(filmo.length);


	// SERIES
	filmo.each(function(index, elem){
		// series[index] = {};
		// series[index]["name"] = $(this).find('a').first().html();
		// var year = $(this).find('.year_column').html().split(';');
		// series[index]["year"] = year[1];

		pattern = /\d{7}/;
        series[index] = $(this).find('a').attr('href').match(pattern);
        series[index].input="www.imdb.com"+series[index].input
	});
	
	return {
		"imdb_id": imdb_id,
		"first_name": first_name,
		"last_name": last_name,
        "s_name": s_name,
		"bio": bio, 
		"pic": pic,						//direccion a un recurso del media server??
		"birth_date": birth_date,
		"birth_place": birth_place,
		"series": series
	}
};

//getLinks receives an html file and returns all links categorized
//getLinks recibe el html y devuelve todos los links categorizados	
module.exports.getLinks = function(html) {
	var $ = cheerio.load(html);
	var pageURL = $('link[rel="canonical"]').attr('href');
	links = [];
	
	//actors list from birth date links (monthday and year)
	var birth_date = $('#name-born-info time a');
	birth_date.each(function(index, elem){
		var url = checkURL(pageURL,this.attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "actors_list"
		 });
	});
	//var filmo = $("#filmography").children("[data-category='actor']").next().children().filter(":contains('(TV Series)')");
	var filmo = $(".filmo-category-section").first().children().filter(":contains('(TV Series)')");
	series = new Array(filmo.length);
	filmo.each(function(index, elem){
		var url = checkURL(pageURL,$(this).find('a').attr('href'));
		links.push({
			"url": url,
			"site": "IMDB",
			"type": "series"
		});
	});


	//obtenemos el link para que busque al actor en metacritic
	//los links en metacritic de personas son de la forma
	//www.metacritic.com/person/jack-nicholson
	var complete_name = $('span[itemprop="name"]').html();

	if( complete_name ){
		complete_name = tidy_string.tidy(complete_name);
		complete_name = complete_name.split(' ');
		complete_name = complete_name.join('-');

		links.push({
			"url": "www.metacritic.com/person/"+complete_name,
			"site": "metacritic",
			"type": "actor"
		});
	}

	return links;
};

var checkURL = function(pageURL,url) {
	if (url.slice(0,1) == '?'){
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

var formatLink = function(bio) {
	link_start = bio.split('href');
	start = link_start[3].indexOf('"')+1;
	end = link_start[3].indexOf('"',start);
	biobio = link_start[3].substring(start,end);//bio.match(/href/g);

	return "www.imdb.com"+biobio;
};
