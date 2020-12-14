$("<style>")
    .prop("type", "text/css")
    .html("\
    .minor-caps-bold { \
       font-weight: bold; \
    } \
    .indent-1 { \
        padding-left: 62px; \
        position: relative; \
        #text-indent: -40px; \
    } \
    .indent-2 { \
        padding-left: 94px; \
        position: relative; \
        text-indent: -40px \
    }\
    .exception-paragrah{ \
        margin-left: 20px; \
        margin-right: 10px; \
    } \
    .exception-name{ \
        font-weight: bold; \
    } \
    .eccn-span {\
        color: white;\
        background-color: #98bf21;\
        padding: 5px \
    }")

    .appendTo("head");

$('p.flush-paragraph-2').each(function (index) {
    var eccn = /([0-9][A-E]\d{3})|(EAR99)/.exec($(this).html());
    if (eccn != null) {
        var line = $(this).html();
        var strongline = line.replace(eccn[0], '<span>' + eccn[0] + '</span>')
        $(this).html(strongline);
        $(this).children("span").addClass("eccn-span")
    }
});

$('p.flush-paragraph-1').each(function (index) {
    if ($(this).has('em') && /(LVS:)|(GBS:)|(STA:)|(APP:)|(TSR:)/.exec($(this).children('em').text())){
        $(this).addClass('indent-1');
        $(this).children('em').addClass('exception-name')
    }
});

$('p span.minor-caps').addClass('minor-caps-bold');

/*
$('em.paragraph-heading').each(function(index) {
    var license_exception = /(LVS:)|(GBS:)|(STA:)|(APP:)|(TSR:)/.exec($(this).html());
    if (license_exception != null) {
        $(this).addClass("")
    }
});
*/


//([0-9][A-E]\d{3})|(EAR99)
