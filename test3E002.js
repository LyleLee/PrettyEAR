function loadScript(src) {
    return new Promise(function (resolve, reject) {
        let s;
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

let deep = 0;
let eccnStak = [];
let dataMap = [];

function ParaseTable(t) {

    deep++;


    $(t).find('tbody').first().find('tr').first().each(function (rindex) {// every table has only one tr

        let trString = "";
        let nextTable = [];

        $(this).children('td').each(function (tdindex) {// every tr has 2 or 3 td
            if (trString != "") {
                //add one space before index
                trString = trString + ' '
            }
            $(this).children().each(function (pindex) { // td has either lines of p or table
                if ($(this).is('table') == true) { 
                    nextTable.push($(this));
                } else {
                    let thistdText = $(this).text().replace(/(\r\n|\n|\r)/gm, "").trim();// tdtext can be 3E002, a,b,c or a line of conetent text.
                    let testResult = /^([0-9][A-E]\d{3})|(EAR99)|^([a-z]\.)|^([1-9]\.)\b/.exec(thistdText);//match an index
                    if (testResult) { // deal with index
                        eccnStak.push(testResult[0]);
                    }
                    if (/^Technical Note:/.exec(thistdText)) { // deal with line of content text
                        trString = trString + '\n' + thistdText;
                    } else {
                        trString = trString + thistdText;
                    }
                }
            });
        });

        for (let i = 0; i < deep; i++) {
            trString = '  ' + trString;
        }

        let thiseccn = "";
        eccnStak.forEach(element => {
            thiseccn = thiseccn + '.' + element;
        });

        //console.log(thiseccn, trString);
        dataMap.push([thiseccn,trString]);


        nextTable.forEach((element) => {
            ParaseTable(element);
        }
        )
    });
    eccnStak.pop();
    console.log(dataMap);

    deep--;

}

$('body > table').each(function (index) {

    let eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());

    if (eccn != null) {
        ParaseTable($(this), '');
    }

});
