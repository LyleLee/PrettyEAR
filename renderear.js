$('p.flush-paragraph-2').each(function(index) {
    var eccn = /([0-9][A-E]\d{3})|(EAR99)/.exec($(this).html());
    if (eccn != null) {
        var line = $(this).html();
        var strongline = line.replace(eccn[0], '<span>' + eccn[0] + '</span>')
        $(this).html(strongline);
        $(this).children("span").css({
            "color": "white",
            "background-color": "#98bf21",
            "padding": "5px"

        });
    }
});

//([0-9][A-E]\d{3})|(EAR99)
