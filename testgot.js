const got = require('got');
const cheerio = require('cheerio');


(async () => {
	try {
		const response = await got('https://eur-lex.europa.eu/eli/reg/2021/821');
		//console.log(response.body);
		//=> '<!doctype html> ...'

        const $ = cheerio.load(response.body);
        

        var deep = 0;


function ParaseTable(t) {

    deep++;

    $(t).find('tbody').first().find('tr').first().each(function(rindex) {

        var trString = "";

        $(this).children('td').each(function(tdindex) {
            //console.log($(this).children(":first").html());
            if (trString != "") {
                trString = trString + ' '
            }
            trString = trString + $(this).children().first().text().replace(/(\r\n|\n|\r)/gm, "").trim();
        });

        for (var i = 0; i < deep; i++) {
            trString = '  ' + trString;
        }

        console.log(trString);

        $(this).children('td').each(function(tdindex) {

            $(this).children('table').each(function(index) {
                ParaseTable($(this));
            });
        });
    });

    deep--;

}

        $('#L_2021206EN\\.01002501 > div > table').each(function(index) {

            var eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());

             if (eccn != null) {
                console.log("********************\n");
                ParaseTable($(this));
            }

        });




	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
})();

