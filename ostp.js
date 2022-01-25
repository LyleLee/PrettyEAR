const buildData = require('@/utils/common-config');

module.exports = async(ctx) => {
    const link = `https://www.whitehouse.gov/ostp/news-updates/`;
    ctx.state.data = await buildData({
        link,
        url: link,
        title: `%title%`,
        params: {
            title: 'Office Of Science And Technology Policy',
        },
        item: {
            item: 'article.news-item.js-animated-child',
            title: `$('.post-account-group').text() + ' - %title%'`, // 只支持$().xxx()这样的js语句，也足够使用
            link: `$('.post-account-group').attr('href')`, // .text()代表获取元素的文本，.attr()表示获取指定属性
            description: `$('.post .context').html()`, // .html()代表获取元素的html代码
            pubDate: `new Date($('.post-time').attr('datetime')).toUTCString()`, // 日期的格式多种多样，可以尝试使用**/utils/date**
            guid: `new Date($('.post-time').attr('datetime')).getTime()`, // guid必须唯一，这是RSS的不同item的标志
        },
    });
};