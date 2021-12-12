function loadScript(src) {
    return new Promise(function(resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function load() {
    if (!window.jQuery) {
        await loadScript(`https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js`);
    }

}

load();

console.clear();

var deep = 0;


function ParaseTable(t, levelEccn) {

    deep++;

    $(t).find('tbody').first().find('tr').first().each(function (rindex) {

        var trString = "";
        var nextTable = [];

        $(this).children('td').each(function(tdindex) {
            if (trString != "") {
                trString = trString + ' '
            }
            $(this).children().each(function(pindex){
                if($(this).is('table') == true){
                    nextTable.push($(this));
                }
                else{
                    trString = trString + $(this).text().replace(/(\r\n|\n|\r)/gm, "").trim();
                }
            });
        });

        for (var i = 0; i < deep; i++) {
            trString = '  ' + trString;
        }

        console.log(trString);

        nextTable.forEach((element) => { ParaseTable(element, levelEccn);} )
    });

    deep--;

}

$('#L_2021206EN\\.01002501 > div > table').each(function(index) {

    var eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());

    if (eccn != null) {
        ParaseTable($(this),'');
    }

});
