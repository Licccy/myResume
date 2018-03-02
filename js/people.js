/**
 * 移动的people
 */

var $peopleContainer = $('.container-people');
var $people = $('.people');
var $blocks = $('.block');
// 获取容器高度
var containerHeight = $('.container').height();
// 动作常量
var peopleMove = {
    static: 0,
    walk: 1,
    stand: 2,
    jump: 3
};

var people = {
    /* 初始化 */
    init: function () {
        this.direction = 'right';
        this.oneMoveImgSize = 200; // 每个动作图片的尺寸
        this.oneMoveDuration = 200; // 每个动作的间隔
        this.jumpBuffer = 150; // 跳跃高度差
        this.peopleBottomEdge = 90; // 人物距离底部距离
        this.peopleRightEdge = 220; // 人物右边距离边界距离
        this.peopleLeftEdge = 80; // 人物左边距离边界距离
    },
    /* 更新方向 */
    updateDirection: function (distance) {
        if (distance > 0) {
            this.direction = 'right';
            $people.css('top', 0);
        } else {
            this.direction = 'left';
            $people.css('top', '-270px');
        }
    },
    /* 设置帧图片 */
    setFrame: function (action) {
        var nextFrameLeft = - peopleMove[action] * this.oneMoveImgSize;
        $people.css({
            left: nextFrameLeft,
        });
    },
    /* 切换人物动作帧 */
    switchMoveFrame: function (frames, callback) {
        var self = this;
        // 若无下一帧
        if (frames.length === 0 || !frames[0]) {
            callback();
            return;
        }
        // 则获取下一帧
        var nextAction = frames.shift();
        this.setFrame(nextAction);
        // 间隔后，切换下一个
        this.shiftTimer = setTimeout(function () {
            self.switchMoveFrame(frames, callback);
        }, this.oneMoveDuration);
    },
    /* 人物行走 */
    walk: function () {
        var self = this;
        // 如果已经移动，则不添加
        if (this.jumping || this.moving) {
            return;
        }
        this.moving = true;
        // 设置一帧动作
        var nextFrames = ['static', 'walk', 'stand'];
        this.switchMoveFrame(nextFrames, function () {
            self.moving = false;
        });
    },
    /* 人物跳跃 */
    jump: function (barrier, downBlock) {
        var self = this;
        this.setFrame('jump');
        this.jumping = true;
        var bottom = containerHeight - barrier.offsetTop + this.jumpBuffer;
        $peopleContainer.stop().animate({
            bottom: bottom
        }, 200, function () {
            downBlock && self.downBlock(barrier);
        })
    },
    /* 降落到指定障碍物 */
    downBlock: function (barrier) {
        var self = this;
        // 下降高度，需要注意图片的边距，这里需要多减 14
        var bottom = containerHeight - barrier.offsetTop;
        $peopleContainer.stop().animate({
            bottom: bottom
        }, 200, function () {
            // 切换状态
            self.setFrame('static');
            self.jumping = false;
        })
    },
    /* 下降函数 */
    drop: function (barrier) {
        var self = this;
        self.setFrame('jump');
        $peopleContainer.stop().animate({
            bottom: this.peopleBottomEdge,
        }, 200, function() {
            // 切换状态
            self.setFrame('static');
            self.jumping = false;
        });
    },
    /* 判断是否即将接触到障碍物 */
    checkBarrier: function (curPos, prePos) {
        var self = this;
        // 遍历所有的障碍物，判断是否需要跳跃
        for (var i = 0, len = $blocks.length; i < len; i++) {
            var barrier = $blocks[i];
            // 获取元素的位置和宽度
            var barrierX = barrier.offsetLeft; 
            var barrierWidth = barrier.offsetWidth;
            // 判断是否需要跳
            var rightNeedJump = (prePos + this.peopleRightEdge <= barrierX) && (curPos + this.peopleRightEdge > barrierX);
            var leftNeedJump = (prePos + this.peopleLeftEdge >= barrierX+ barrierWidth) && (curPos + this.peopleLeftEdge < barrierX + barrierWidth);
            // 如果需要跳跃
            if (rightNeedJump || leftNeedJump) {
                var needDownBlock = curPos > barrierX - this.peopleRightEdge && curPos < barrierX + barrierWidth - this.peopleLeftEdge;
                // 判断是否会落在障碍物
                this.jump(barrier, needDownBlock);
            }
            // 判断是否是在障碍物上，然后需要从障碍物落下
            var rightNeedFall = (prePos + this.peopleLeftEdge <= barrierX + barrierWidth) && (curPos + this.peopleLeftEdge > barrierX + barrierWidth);
            var leftNeedFall = (prePos + this.peopleRightEdge > barrierX) && (curPos + this.peopleRightEdge) <= barrierX;
            // 如果需要落下障碍物
            if (rightNeedFall || leftNeedFall) {
                this.drop(barrier);
            }
        }
    }
}