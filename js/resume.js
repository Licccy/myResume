/**
 * 简历
 */
var $window = $(window);
var loading = $('.loading');
var selfInfo = $('.self-info');
var resumePage = $('.page');
var images = [
  './img/people.png',
  './img/mountain.png',
  './img/cloud.png',
  './img/background.png',
  './img/pipe.png',
  './img/trees.png',
  './img/project.png',
];

var resume = {
    /* 初始化操作-页面入口 */
    init: function() {
        var self = this;
        // 初始化其他组件
        people.init();
        // 页面滚动最开始
        $window.scrollTop(0);
        // 加载资源
        resource.resourceLoad(images, function(result) {
            // 绑定事件
            self.bindEvent();
        });
    },
    /* 事件绑定 */
    bindEvent: function () {
        var self = this;
        var curPos = 0; // 当前位置
        var prePos = 0; // 之前位置
        // 去除loading加载页面
        $window.on('click', '.loading', function () {
            loading.fadeOut();
        });
        // 监听滚动事件
        $window.on('scroll', function () {
            // 设置当前页面滚动位置
            curPos = $window.scrollTop();
            // 计算移动距离
            var distance = curPos - prePos;
            // 更新人物状态
            people.updateDirection(distance);
            // 背景移动
            scense.move(curPos);
            // 判断是否跳跃
            people.checkBarrier(curPos, prePos);
            // 人物走动
            people.walk();
            // 更新 prePos
            prePos = curPos;
        });
        // 开始建立按钮
        $window.on('click', '.name', function () {
            selfInfo.hide();
            resumePage.css({
                height: scense.computedWidth()
            });
        });
        // 当修改浏览器窗口大小的时候，需要重新设置
        $window.on('resize', function () {
            resumePage.css({
                height: scense.computedWidth()
            });
        });
    }
}

// 页面初始化
resume.init();