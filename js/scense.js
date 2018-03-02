/**
 * 场景对象
 */

var $scense = $('.container-horizontal');
var $cloud = $scense.find('.cloud');
var $mountain = $scense.find('.mountain');

var scense = {
    computedWidth: function () {
        return $scense.width() - $('.container').width();
    },
    /* 背景移动 */
    move: function (curPos) {
        // 整体向左移动
        $scense.css({
            left: -curPos
        });
        // 山较远，移动 1-0.75=0.25
        $mountain.css({
            left: curPos * 0.75
        });
        // 云更远，移动 1-0.95=0.05
        $cloud.css({
            left: curPos * 0.95
        });
    }
}