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


let deep = 0;
let dataMap = [];

function GetAllDeepECCN(tableECCN) {
    let allECCN = "";

    if (tableECCN.length == 0)
        return allECCN;

    allECCN = tableECCN[0];
    for (let i = 1; i < tableECCN.length; ++i) {
        allECCN = allECCN + '.' + tableECCN[i];
    }
    return allECCN;
}

function ReplaceAndTrim(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "").trim();
}

function HasItalic(node) {
    $(node).find('span').each(function(index) {
        if ($(this).hasClass('oj-italic')) return true;
    });
    return false;
}

function ParaseTable(t, tableECCN) {
    deep++;

    let tableData = [];
    let currentECCN = GetAllDeepECCN(tableECCN);
    let currentText = "";
    let tr = $(t).find('tbody').first().find('tr').first(); //every table has only 1 tr
    let tds = $(tr).children('td'); // every tr has 2 or 3 td
    let td = null; // table, text, p
    let tdECCN = null;

    if (tds.length == 3) { // it is a top level table, et: 3E002
        tdECCN = tds[1];
        //currentECCN = currentECCN + '.' + ReplaceAndTrim($(tds[1]).text());
        td = tds[2];
    } else { // not top level table.
        tdECCN = tds[0];
        td = tds[1];
    }

    if (currentECCN == '') {
        currentECCN = ReplaceAndTrim($(tdECCN).text());
    } else {
        currentECCN = currentECCN + '.' + ReplaceAndTrim($(tdECCN).text());
    }

    let tdchilds = $(td).children();

    if (tdchilds.length == 1) // only text
    {
        currentText = ReplaceAndTrim($(td).text());
        console.log(currentECCN, '--', currentText);
    } else if (tdchilds.length > 1) { // text,table,p.annotion

        currentText = ReplaceAndTrim($(tdchilds[0]).text()); // a.A 'vector processor unit' designed to perform more than
        console.log(currentECCN, '--', currentText);

        let complexECCN = '';
        let belongAnnotation = false;
        for (let i = 1; i < tdchilds.length; ++i) {

            if ($(tdchilds[i]).is('p') && $(tdchilds[i]).hasClass('oj-ti-annotation')) { //Technical Note: //Technical Notes:
                complexECCN = currentECCN + ReplaceAndTrim($(tdchilds[i]).text());
                currentText = ReplaceAndTrim($(tdchilds[i]).text());
                belongAnnotation = true;
                console.log(complexECCN, '--', currentText);
                continue;
            }
            if ($(tdchilds[i]).is('table') && belongAnnotation == true && HasItalic(tdchilds[i]) == true) {
                tableECCN.push(complexECCN)
                ParaseTable($(tdchilds[i]), tableECCN);
                tableECCN.pop();
                continue;
            }
            if ($(tdchilds[i]).is('p') && belongAnnotation == true && HasItalic(tdchilds[i]) == true) {
                currentText = $(tdchilds[i]).text();
                console.log(complexECCN, '--', currentText);
                continue;
            }
            if ($(tdchilds[i]).is('table') && belongAnnotation == false) {
                tableECCN.push(currentECCN)
                ParaseTable($(tdchilds[i]), tableECCN);
                tableECCN.pop();
            }
        }

    } else {
        console.log('error');
    }

}

$('body > table').each(function(index) {

    let eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec($(this).text().replace(/(\r\n|\n|\r)/gm, "").trim());
    let tableECCN = [];

    if (eccn != null) {
        ParaseTable($(this), tableECCN);
    }

});