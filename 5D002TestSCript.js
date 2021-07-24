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

function SpaceByNumber(n) {
    for (var i = 0; i < deep; i++) {
        trString = ' ' + trString;
    }
}

function ParaseTable(t) {

    deep++;

    $(t).find('tbody:first > tr').each(function(rindex) {

        var trString = "";

        $(this).children('td').each(function(tdindex) {
            //console.log($(this).children(":first").html());
            trString = trString + ' ' + $(this).children(":first").text().replace(/(\r\n|\n|\r)/gm, "").trim();
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

ParaseTable($('body > table'));