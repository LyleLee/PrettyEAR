function loadScript(src) {
    return new Promise(function(resolve, reject) {
        let s;
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

await load();

console.clear();

function TableTool(table) {

    let deep = 0;
    let dataMap = [];
    tableECCN = [];

    ParaseTable($(table), tableECCN);

    function GetAllDeepECCN(tableECCN) {
        let allECCN = "";

        if (tableECCN.length == 0)
            return allECCN;

        allECCN = tableECCN[0];
        for (let i = 1; i < tableECCN.length; ++i) {
            allECCN += tableECCN[i];
        }
        return allECCN;
    }

    function ReplaceAndTrim(text) {
        return text.replace(/(\r\n|\n|\r)/gm, "").trim();
    }

    function HasItalic(node) {

        if ($(node).hasClass('oj-italic')) return true;

        let span = $(node).find('span');

        for (let i = 0; i < span.length; i++) {
            if ($(span[i]).hasClass('oj-italic')) {
                //console.log("has oj-italic");
                return true;
            }
        }
        return false;
    }

    function ParaseTable(t, tableECCN) {
        deep++;

        let tableData = [];
        let longECCN = '';
        let miniECCN = '';
        let currentText = "";
        let tr = $(t).find('tbody').first().find('tr').first(); //every table has only 1 tr
        let tds = $(tr).children('td'); // every tr has 2 or 3 td
        let td = null; // table, text, p
        let tdECCN = null;

        if (tds.length == 3) { // it is a top level table, et: 3E002
            tdECCN = tds[1];
            //longECCN = longECCN + '.' + ReplaceAndTrim($(tds[1]).text());
            td = tds[2];
        } else { // not top level table.
            tdECCN = tds[0];
            td = tds[1];
        }

        miniECCN = ReplaceAndTrim($(tdECCN).text()); // a or b or c ..

        if (miniECCN[miniECCN.length - 1] != '.') {
            miniECCN += '.'
        }
        tableECCN.push(miniECCN);

        longECCN = GetAllDeepECCN(tableECCN);

        let tdchilds = $(td).children();

        if (tdchilds.length == 1) // only text
        {
            currentText = ReplaceAndTrim($(td).text());
            dataMap.push([longECCN, currentText]);
            console.log(longECCN, '--', currentText);
        } else if (tdchilds.length > 1) { // text,table,p.annotion

            currentText = ReplaceAndTrim($(tdchilds[0]).text()); // a.A 'vector processor unit' designed to perform more than
            console.log(longECCN, '--', currentText);
            dataMap.push([longECCN, currentText]);

            let techNote = '';
            let belongAnnotation = false;
            for (let i = 1; i < tdchilds.length; ++i) {
                if ($(tdchilds[i]).is('p') && $(tdchilds[i]).hasClass('oj-ti-annotation')) { //Technical Note: //Technical Notes:
                    techNote = ReplaceAndTrim($(tdchilds[i]).text());
                    currentText = techNote;
                    tableECCN.push(techNote) // //Technical Note: //Technical Notes:
                    longECCN = GetAllDeepECCN(tableECCN);
                    console.log(longECCN, '--', currentText);
                    dataMap.push([longECCN, currentText]);
                    belongAnnotation = true;
                    continue;
                }
                if ($(tdchilds[i]).is('table') && belongAnnotation == true && HasItalic(tdchilds[i])) { //note table
                    ParaseTable($(tdchilds[i]), tableECCN);
                    continue;
                }
                if ($(tdchilds[i]).is('p') && belongAnnotation == true && HasItalic(tdchilds[i])) { //note paragrah
                    currentText = $(tdchilds[i]).text();
                    console.log(longECCN, '--', currentText);
                    dataMap.push([longECCN, currentText]);
                    continue;
                }
                if ($(tdchilds[i]).is('table') && belongAnnotation == false) {
                    ParaseTable($(tdchilds[i]), tableECCN);
                }
            }
            if (belongAnnotation == true) {
                tableECCN.pop(); // pop techNote when loop end.
            }

        } else {
            console.log('error');
        }
        tableECCN.pop();
    }

    return dataMap;
}

$('body > table').each(function(index) {

    let eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());
    let tableECCN = [];

    if (eccn != null) {
        let datar = TableTool($(this));

        console.log('things in datamap');
        console.log(datar);
    }


});