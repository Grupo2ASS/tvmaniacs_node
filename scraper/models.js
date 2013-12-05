var mongoose = require('mongoose');

// En este modulo se definen todas las tablas de nuestro modelo en mongo

Schema = mongoose.Schema;

actor = new Schema({
	imdb_id: String,
    first_name: String, 
    last_name: String,
    s_name: String,
    score: Number,              //(metacritic)    
    high_score: Number,             //(metacritic)
    low_score: Number,              //(metacritic)
    bio: String,    
    pic: String,
    birth_date: Date,
    birth_place: String,
    series: [String],

    //faltaba el degree
    degree: Number
});

review = new Schema({			//(metacritic)
	score: Number,
	name: String,
	institution: String,
	comment: String,
	date: String,
	link: String,
	critic: Boolean				//True si la review es de un critico. False si es de una persona corriente
});

chapter = new Schema({
	name: String,
	description: String,
	user_rating: Number
});


season = new Schema({
	number: Number,
	chapters: [chapter],
	reviews: [review]
});


series = new Schema({
	imdb_id: String, 
	name: String,
    s_name: String,
	user_rating: Number, //(metacritic)
	metascore: Number,	//(metacritic)
	description: String,
	length: Number,
	genre: [String],
	pic: String,
	year_start: Number,
	year_end: Number,
	cast: [String],
	seasons: [season]
});


module.exports.actorModel = mongoose.model('actor', actor);
module.exports.reviewModel = mongoose.model('review', review);
module.exports.chapterModel = mongoose.model('chapter', chapter);
module.exports.seasonModel = mongoose.model('season', season);
module.exports.serieModel = mongoose.model('series', series);
