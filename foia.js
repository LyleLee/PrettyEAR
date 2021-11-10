$('table.warninglettertable').find('tr:gt(1)').each(function(index){

    var CaseLink = 'https://efoia.bis.doc.gov'+$(this).children('td:eq(0)').find('a').attr('href');
    var CaseName = $(this).children('td:eq(1)').text();
    var OrderDate = $(this).children('td:eq(2)').text();

    console.log(CaseLink, CaseName, OrderDate);

});


