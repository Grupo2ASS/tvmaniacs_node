fs = require('fs');
config = require('../../config/config.json')
init = require('../../config/init_workspace');
describe("file initialization", function () {

	it('is creating db file', function() {
		expect(fs.existsSync(config['db_file'])).toBe(true);
	});

	it('is creating imdb folders', function() {
		for (var i = 0; i < init.sub_folders.length; i++)
		{
			expect(fs.existsSync('../html_folder/imdb/'+init.sub_folders[i])).toBe(true);
		}
	});

	it('is creating metacritic folders', function() {
		for (var i = 0; i < init.sub_folders.length; i++)
		{
			expect(fs.existsSync('../html_folder/metacritic/'+init.sub_folders[i])).toBe(true);
		}
	});
});
