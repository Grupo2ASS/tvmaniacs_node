TVManiacs Crawler/Scraper
=========================

This repo has 2 Node.js projects, developed by Group 2 of *Arquitectura de Sistemas de Software* 2013-2, from Pontificia Universidad Católica de Chile (PUC).
Both are independent modules with specific functions.

Crawler
-------
Uses sylvinus' node-crawler(https://github.com/sylvinus/node-crawler).

*	Gets urls for http://www.metacritic.com/ and http://www.imdb.com/tv/ from local database (with scheduled revisiting) or randomly generates them.
*	Gets html files and cleans them (to save memory space).
* Stores clean HTML files on HDD.

Scraper
-------
Uses cheerio (https://github.com/MatthewMueller/cheerio)

*	Reads .html files from HDD
*	Stores links to other pages to be visited by the crawler on a local DB.
*	Gets information about actors and tv series and stores them on dedicated MongoDB server.

Workflow
--------

![Diagram](https://raw.github.com/iufuenza/tvmaniacs_node/master/Blank.png)
The Cacoo diagram is editable at https://cacoo.com/diagrams/doKBa3jfieyMd57k


Project Management
------------------
Kanbanery (https://kanbanery.com/) is used for tracking. This project's URL is https://tvmaniacs.kanbanery.com/

Rules
--------------------
1.	You don't talk about fight club.
2.	Code and comments **must** be in English.
3.	**Don't write any passwords on any part of the repo.** If they need to be *hardcoded*, please reference a file on the server where this information is stored, or at least git-ignore the file.
