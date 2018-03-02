/**
 * 页面加载
 */

setInterval (function () {
    $('.dots').removeClass('animate');
    setTimeout(function(){
        $('.dots').addClass('animate');
    }, 200)
}, 3000);