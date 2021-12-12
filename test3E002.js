function loadScript(src) {
    return new Promise(function(resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    }
    );
}

async function load() {
    if (!window.jQuery) {
        await loadScript(`https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js`);
    }

}

load();

console.clear();

var deep = 0;
var eccnStak = [];

function ParaseTable(t) {

    deep++;


    $(t).find('tbody').first().find('tr').first().each(function(rindex) {

        var trString = "";
        var nextTable = [];

        $(this).children('td').each(function(tdindex) {
            if (trString != "") {
                //add one space before index
                trString = trString + ' '
            }
            $(this).children().each(function(pindex) {
                // td has either p or table
                if ($(this).is('table') == true) {
                    nextTable.push($(this));
                } else {
                    var thistdText = $(this).text().replace(/(\r\n|\n|\r)/gm, "").trim();
                    var testResult = /^([0-9][A-E]\d{3})|(EAR99)|^([a-z]\.)|^([1-9]\.)\b/.exec(thistdText);
                    if (testResult) {
                       eccnStak.push(testResult[0]);
                    }
                    if (/^Technical Note:/.exec(thistdText)) {
                        trString = trString + '\n' + thistdText;
                    } else {
                        trString = trString + thistdText;

                    }

                }
            });
        });

        for (var i = 0; i < deep; i++) {
            trString = '  ' + trString;
        }
        
        var thiseccn = "";
        eccnStak.forEach(element => { 
            thiseccn+=element;
        });

        eccnStak.pop();
        
        console.log(thiseccn, trString);

        nextTable.forEach((element)=>{
            ParaseTable(element);
        }
        )
    });

    deep--;

}

$('body > table').each(function(index) {

    var eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());

    if (eccn != null) {
        ParaseTable($(this), '');
    }

});
