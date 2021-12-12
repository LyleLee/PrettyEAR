const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
    try {
        console.log('fetch url');
        const response = await got('https://eur-lex.europa.eu/eli/reg/2021/821');
        //console.log(response.body);
        //=> '<!doctype html> ...'
        console.log(response.statusCode);

        const $ = cheerio.load(response.body);

        console.log('html loaded');


        var deep = 0;


        function ParaseTable(t, eccn) {

            deep++;

            $(t).find('tbody').first().find('tr').first().each(function (rindex) {

                var trString = "";

                $(this).children('td').each(function (tdindex) {
                    //console.log($(this).children(":first").html());
                    if (trString != "") {
                        trString = trString + ' '
                    }
                    trString = trString + $(this).children().first().text().replace(/(\r\n|\n|\r)/gm, "").trim();
                });

                for (var i = 1; i < deep; i++) {
                    trString = '  ' + trString;
                }


                fs.writeFile(eccn + '.txt', trString + '\n', { flag: 'a' }, (err) => {
                    if (err) {
                        console.log('write error when precessing::', eccn)
                        throw err;
                    }
                });

                //console.log(trString);

                $(this).children('td').each(function (tdindex) {

                    $(this).children('table').each(function (index) {
                        ParaseTable($(this), eccn);
                    });
                });
            });

            deep--;

        }

        $('#L_2021206EN\\.01002501 > div > table').each(function (index) {

            var eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());
            if (eccn != null) {
                fs.exists(eccn[1] + '.txt', function (exists) {
                    if (exists) {
                        fs.unlinkSync(eccn[1] + '.txt');
                    }
                });
                //fs.unlinkSync(eccn[1]+'.txt');
                ParaseTable($(this), eccn[1]);
            }

        });




    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();

