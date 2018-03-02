/**
 * 资源
 */

var resource = {
    /* 加载图片 */
    imgLoad: function (src, callback) {
        var image = new Image();
        // 图片加载
        image.addEventListener('load', callback);
        image.addEventListener('error', function (e) {
            console.error('img error', e);
        });
        image.src = src;
        return image;
    },
    /* 资源加载 */
    resourceLoad: function (images, callback) {
        images = images|| [];
        // 需加载的总数
        var total = images.length;
        // 已完成的个数
        var finish = 0;
        if (total === 0) {
            return callback([]);
        }
        // 保存加载后的图片对象
        this.images = [];
        var self = this;
        // 遍历加载图片
        var len = images.length;
        for (var i = 0; i < len; i ++) {
            var src = images[i];
            // 保存
            self.images[i] = self.imgLoad(src, function () {
                // 加载完成
                finish ++;
                // 判断是否加载完成
                if (finish === total) {
                    // 全部加载完成
                    callback(self.images);
                }
            });
        }
    }
}