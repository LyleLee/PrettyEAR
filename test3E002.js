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

await load();

console.clear();


let deep = 0;
let dataMap = [];

function ParaseTable(t, tableECCN) {
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
                    let testResult = /^(\d[A-E]\d{3})|(EAR99)|^([a-z]\.)|^(\d\.)|(Note\s\d:)/.exec(thistdText);//match an index
                    if (thistdText.length < 8 && testResult) { // deal with index, some long conetent text could begin with an index, that is why we set length limit 8
                        if (/\d[A-E]\d{3}/.exec(thistdText)) {
                            tableECCN.push(thistdText + '.'); //3E002.
                        }
                        else if (/Note\s\d:/.exec(thistdText)) {
                            tableECCN.push(thistdText.split(':')[0] + '.'); //Note 1.
                        }
                        else {
                            tableECCN.push(testResult[0]); // a. b. c.
                        }
                    }
                    if (/^Technical Notes:/.exec(thistdText)) { // deal with line of content text
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

        let currentECCN = "";
        tableECCN.forEach(element => {
            currentECCN = currentECCN + element;
        });

        console.log(currentECCN, trString);

        nextTable.forEach((element) => {
            ParaseTable(element, tableECCN);
        });

        tableECCN.pop();
    });
    deep--;
}

$('body > table').each(function (index) {

    let eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());
    let tableECCN = [];

    if (eccn != null) {
        ParaseTable($(this), tableECCN);
    }

});
