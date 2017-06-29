//多行循环轮播
var $marquees = $('.marquees');
setInterval(function(){
    var $marquee_1 = $('.marquees p').eq(0);
    $marquee_1.appendTo($marquees);
},5000);


var $marquee2 = $('marquee');
setInterval(function(){
    $marquee2.attr('direction','right');
    var htmm = $marquee2.html();
    $marquee2.empty().html(htmm);
},5000);