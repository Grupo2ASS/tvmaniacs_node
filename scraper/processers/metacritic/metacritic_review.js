var cheerio = require('cheerio');

//This is a module, which make this code behave as an API
//Lo siguiente es un modulo, lo que nos permite tener variables
//locales y que hace que el archivo se comporte como una API
(function() {

	var getInfo = function(html) {
		reviews = [];
		var $ = cheerio.load(html);
		var score, name, institution, comment, date, link, critic;
		//score es number
		//critic es True si la review es de un critico. False si es de una persona corriente

		//obtenemos todas las reviews de criticos	
		var allCriticsReviews = $('ol[class = "reviews critic_reviews"]').find('div[class="review_content"]');

		allCriticsReviews.each(function(index, elem){
			
			//console.log("Review de critico numero "+index);
			
			score = parseInt($(this).find(".review_stats").find("div[class^='review_grade']").text().trim()); 
			name = $(this).find(".review_stats").find("div[class^='review_critic']"/*".review_critic.has_author"*/).find(".author").find('a').text();
			institution = $(this).find(".review_stats").find(".review_critic.has_author").find(".source").find('a').text();	
			comment=$(this).find(".review_body").text().trim();
			date = null; //no hay
			link=$(this).find(".review_section.review_actions").find(".review_action.full_review").find('a').attr('href');//text().trim();
			critic=true;

			/*
			console.log("Score: "+score);
			console.log("Name: "+name);
			console.log("Institution: "+institution);
			console.log("Comment: "+comment);
			console.log("Date: "+date);
			console.log("Link: "+link);	
			console.log("Critic: "+critic);
			console.log(" ");
			*/

			reviews.push({
			"Score": score,
			"Name": name,
			"Institution": institution,
			"Comment": comment,
			"Date": date,
			"Link": link,	
			"Critic": critic
			});
		
		});
			
		//obtenemos todas las reviews de usuarios	
		var allUsersReviews = $('ol[class = "reviews user_reviews"]').find('div[class="review_content"]');

		allUsersReviews.each(function(index, elem){
			
			//console.log("Review de usuario numero "+index);
			
			score = parseInt($(this).find(".review_stats").find("div[class^='review_grade']").text().trim()); 
			name = $(this).find(".review_stats").find("div[class^='review_critic']").find(".name").children().text();	
			institution = null;	//no hay
			comment= $(this).find(".review_body").text().trim();
			date = $(this).find(".review_stats").find("div[class^='review_critic']").find(".date").text();	
			link=null; //no hay
			critic=false;

			/*
			console.log("Score: "+score);
			console.log("Name: "+name);
			console.log("Institution: "+institution);
			console.log("Comment: "+comment);
			console.log("Date: "+date);
			console.log("Link: "+link);	
			console.log("Critic: "+critic);
			console.log(" ");
			*/
			reviews.push({
			"Score": score,
			"Name": name,
			"Institution": institution,
			"Comment": comment,
			"Date": date,
			"Link": link,	
			"Critic": critic
			});
		
		});		

		return reviews;
		
	};

	var getLinks = function(html) {
		
		//AL PARECER NO HAY LINKS INTERESANTES
		links = [];
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
