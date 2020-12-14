$('p.flush-paragraph').each(function(index){
    var a = /Items:\sa\./.exec($(this).text());
    if (a != null) {
        var items = $(this).children('em').html();
        $(this).children('em').remove();
        var itemsa = $(this).text();
        $(this).replaceWith('<p><em>'+items+'</em></p><p>'+itemsa+'</p>');
    } 
 });