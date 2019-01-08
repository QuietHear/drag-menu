var dragMenu = {
    //永远的固定值
    $parent: $('.btnGroup'),//父元素JQ对象
    $first: $('.btnGroup .item:nth-child(1)'),//第一个子元素JQ对象
    $second: $('.btnGroup .item:nth-child(2)'),//第二个子元素JQ对象
    ITEMWIDTH: null,//元素的宽
    ITEMHEIGHT: null,//元素的高
    ITEMNUM: null,//元素个数
    ENDTIME: null,//检测拖拽动画结束定时器
    STEP: 6,//步数间隔=实际间隔+1
    MOVEBETWEEN: 10,//上下跳动距离
    //根据屏幕尺寸改变的固定值
    WINDOWWIDTH: null,//屏幕最大宽
    WINDOWHEIGHT: null,//屏幕最大高
    FATHERX: null,//父元素横坐标
    FATHERY: null,//父元素纵坐标
    STATICWIDTH: null,//改变页面大小可移动最大宽
    STATICHEIGHT: null,//改变页面大小可移动最大高
    NOWX: null,//元素当前left值
    NOWY: null,//元素当前top值
    //动态改变的值
    beginX: null,//开始横坐标
    beginY: null,//开始纵坐标
    clickX: null,//拖拽开始前点击的位置距离父元素X
    clickY: null,//拖拽开始前点击的位置距离父元素Y
    moveX: null,//移动横坐标
    moveXMin: null,//移动时横坐标最小值
    moveXMax: null,//移动时横坐标最大值
    moveY: null,//移动纵坐标
    moveYMin: null,//移动时纵坐标最小值
    moveYMax: null,//移动时纵坐标最大值
    firstTime: true,//第一次进入界面
    needCheck: false,//判断元素是否需要检查
    isPC: true,//是否是PC端
    arr: [],//存放位置路径
    endX: null,//结束横坐标
    endY: null,//结束横坐标
    start: function () {//载入开始
        this.ITEMWIDTH = parseInt(this.$first.css('width'));
        this.ITEMHEIGHT = parseInt(this.$first.css('height'));
        this.ITEMNUM = this.$parent.find('.item').length;
        //初始化页面上一些静态数据
        this.notDragMax();
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.isPC = false;
        }
        if (this.isPC) {
            this.$first.on({
                'mousedown': this.moveBegin.bind(this)
            });
        }
        else {
            this.$first.on({
                'touchstart': this.moveBegin.bind(this)
            });
        }
        //改变页面大小时调整位置
        $(window).on('resize', this.notDragMax.bind(this));
    },
    checkCollapse: function () {//检查是否需要收起菜单
        if (this.needCheck) {
            if (parseInt(this.$first.css('top')) > parseInt(this.$second.css('top'))) {
                this.toTop();
            }
            else if (parseInt(this.$first.css('top')) < parseInt(this.$second.css('top'))) {
                this.toBottom();
            }
            else if (parseInt(this.$first.css('left')) > parseInt(this.$second.css('left'))) {
                this.toLeft();
            }
            else if (parseInt(this.$first.css('left')) < parseInt(this.$second.css('left'))) {
                this.toRight();
            }
        }
    },
    showMenu: function () {//展示菜单
        let nowX, nowY, x, y;//距离边界的横纵坐标和距离
        //当前位置定位
        nowX = this.$first.offset().left;
        nowY = this.$first.offset().top;
        if (nowX > this.STATICWIDTH / 2) {//右边
            if (nowY < this.STATICHEIGHT / 2) {//右上
                x = this.WINDOWWIDTH - nowX - this.ITEMWIDTH;
                y = nowY;
                if (x > y) {
                    this.toBottom();
                }
                else if (x < y) {
                    this.toLeft();
                }
                else {
                    this.toBottom();
                }
            }
            else {//右下
                x = this.WINDOWWIDTH - nowX - this.ITEMWIDTH;
                y = this.WINDOWHEIGHT - nowY - this.ITEMHEIGHT;
                if (x > y) {
                    this.toTop();
                }
                else if (x < y) {
                    this.toLeft();
                }
                else {
                    this.toTop();
                }
            }
        }
        else {//左边
            if (nowY < this.STATICHEIGHT / 2) {//左上
                x = nowX;
                y = nowY;
                if (x > y) {
                    this.toBottom();
                }
                else if (x < y) {
                    this.toRight();
                }
                else {
                    this.toBottom();
                }
            }
            else {//左下
                x = nowX;
                y = this.WINDOWHEIGHT - nowY - this.ITEMHEIGHT;
                if (x > y) {
                    this.toTop();
                }
                else if (x < y) {
                    this.toRight();
                }
                else {
                    this.toTop();
                }
            }
        }
    },
    toTop: function () {//向上展开
        let it = this;
        if (this.$first.css('top') !== this.$second.css('top')) {//收回
            this.needCheck = false;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({top: it.NOWY + it.MOVEBETWEEN}, 50);
                    $(this).animate({top: it.NOWY - it.MOVEBETWEEN}, 100);
                    $(this).animate({top: it.NOWY}, 50);
                }
            });
        }
        else {//展开
            this.needCheck = true;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({top: it.NOWY - (index * (it.ITEMHEIGHT + it.MOVEBETWEEN) + it.MOVEBETWEEN)}, 50);
                    $(this).animate({top: it.NOWY - (index * (it.ITEMHEIGHT + it.MOVEBETWEEN))}, 100);
                }
            });
        }
    },
    toBottom: function () {//向下展开
        let it = this;
        if (this.$first.css('top') !== this.$second.css('top')) {//收回
            this.needCheck = false;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({top: it.NOWY - it.MOVEBETWEEN}, 50);
                    $(this).animate({top: it.NOWY + it.MOVEBETWEEN}, 100);
                    $(this).animate({top: it.NOWY}, 50);
                }
            });
        }
        else {//展开
            this.needCheck = true;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({top: it.NOWY + (index * (it.ITEMHEIGHT + it.MOVEBETWEEN) + it.MOVEBETWEEN)}, 50);
                    $(this).animate({top: it.NOWY + (index * (it.ITEMHEIGHT + it.MOVEBETWEEN))}, 100);
                }
            });
        }
    },
    toLeft: function () {//向左展开
        let it = this;
        if (this.$first.css('left') !== this.$second.css('left')) {//收回
            this.needCheck = false;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({left: it.NOWX + it.MOVEBETWEEN}, 50);
                    $(this).animate({left: it.NOWX - it.MOVEBETWEEN}, 100);
                    $(this).animate({left: it.NOWX}, 50);
                }
            });
        }
        else {//展开
            this.needCheck = true;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({left: it.NOWX - (index * (it.ITEMWIDTH + it.MOVEBETWEEN) + it.MOVEBETWEEN)}, 50);
                    $(this).animate({left: it.NOWX - (index * (it.ITEMWIDTH + it.MOVEBETWEEN))}, 100);
                }
            });
        }
    },
    toRight: function () {//向右展开
        let it = this;
        if (this.$first.css('left') !== this.$second.css('left')) {//收回
            this.needCheck = false;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({left: it.NOWX - it.MOVEBETWEEN}, 50);
                    $(this).animate({left: it.NOWX + it.MOVEBETWEEN}, 100);
                    $(this).animate({left: it.NOWX}, 50);
                }
            });
        }
        else {//展开
            this.needCheck = true;
            this.$parent.find('.item').each(function (index) {
                if (index > 0) {
                    $(this).animate({left: it.NOWX + (index * (it.ITEMWIDTH + it.MOVEBETWEEN) + it.MOVEBETWEEN)}, 50);
                    $(this).animate({left: it.NOWX + (index * (it.ITEMWIDTH + it.MOVEBETWEEN))}, 100);
                }
            });
        }
    },
    moveBegin: function (event) {//鼠标按下
        if (this.isPC) {
            this.clickX = event.offsetX;
            this.clickY = event.offsetY;
        }
        else {
            this.clickX = event.originalEvent.changedTouches[0].clientX - this.$first.offset().left;
            this.clickY = event.originalEvent.changedTouches[0].clientY - this.$first.offset().top;
        }
        this.beginX = this.$first.offset().left;
        this.beginY = this.$first.offset().top;
        this.moveXMin = this.clickX;
        this.moveXMax = this.STATICWIDTH + this.clickX;
        this.moveYMin = this.clickY;
        this.moveYMax = this.STATICHEIGHT + this.clickY;
        this.arr = [];
        //临时保存当前的元素的位置，若元素移动则会被清除
        this.NOWX = this.beginX - this.FATHERX;
        this.NOWY = this.beginY - this.FATHERY;
        if (this.isPC) {
            $('html').on({'mousemove': this.moveIng.bind(this), 'mouseup': this.moveEnd.bind(this)});
        }
        else {
            $('html').on({'touchmove': this.moveIng.bind(this), 'touchend': this.moveEnd.bind(this)});
        }
    },
    moveIng: function (event) {//鼠标移动
        this.checkCollapse();
        let it = this;
        if (this.isPC) {
            this.moveX = event.clientX;
            this.moveY = event.clientY;
        }
        else {
            this.moveX = event.originalEvent.changedTouches[0].clientX;
            this.moveY = event.originalEvent.changedTouches[0].clientY;
        }
        //横坐标极限判断
        if (this.moveX < this.moveXMin) {
            this.NOWX = 0 - this.FATHERX;
        }
        else if (this.moveX > this.moveXMax) {
            this.NOWX = this.STATICWIDTH - this.FATHERX;
        }
        else {
            this.NOWX = this.moveX - this.FATHERX - this.clickX;
        }
        //纵坐标极限判断
        if (this.moveY < this.moveYMin) {
            this.NOWY = 0 - this.FATHERY;
        }
        else if (this.moveY > this.moveYMax) {
            this.NOWY = this.STATICHEIGHT - this.FATHERY;
        }
        else {
            this.NOWY = this.moveY - this.FATHERY - this.clickY;
        }
        this.arr.push([this.NOWX, this.NOWY]);
        this.$parent.find('.item').each(function (index) {
            if (it.arr.length > index * it.STEP) {
                $(this).css({
                    'left': it.arr[it.arr.length - 1 - it.STEP * index][0],
                    'top': it.arr[it.arr.length - 1 - it.STEP * index][1]
                });
            }
        });
        if (this.arr.length > (it.STEP * (this.ITEMNUM - 1) + 1)) {//节省内存
            this.arr.shift();
        }
        if (this.ENDTIME !== null || this.ENDTIME !== undefined) {
            clearTimeout(this.ENDTIME);
        }
        this.ENDTIME = setTimeout(this.dragStop.bind(this), 500);
    },
    moveEnd: function () {//鼠标松开
        this.endX = this.$first.offset().left;
        this.endY = this.$first.offset().top;
        //清除多余事件，防止多次绑定
        if (this.isPC) {
            $('html').unbind('mousemove mouseup');
        }
        else {
            $('html').unbind('touchmove touchend');
        }
        if (this.beginX === this.endX && this.beginY === this.endY) {//为简单单击事件时
            this.showMenu();
        }
    },
    dragStop: function () {//拖拽结束或停止动画
        if (this.arr.length === 1) {//防止只记录了一步，默认从上到下
            this.arr.unshift([this.arr[0][0], this.arr[0][1] - 1]);
        }
        let x, y;//最终移动差值
        //倒数第二个点
        let x1 = this.arr[this.arr.length - 2][0];
        let y1 = this.arr[this.arr.length - 2][1];
        //最后一个点
        let x2 = this.arr[this.arr.length - 1][0];
        let y2 = this.arr[this.arr.length - 1][1];
        let differX = Math.abs(x2 - x1);
        let differY = Math.abs(y2 - y1);
        if (differX === 0) {
            x = 0;
            y = this.MOVEBETWEEN;
        }
        else {
            x = Math.sqrt(Math.pow(this.MOVEBETWEEN, 2) * Math.pow(differX, 2) / (Math.pow(differX, 2) + Math.pow(differY, 2)));
            y = x * differY / differX;
        }
        this.$parent.find('.item').each(function (index) {
            let one = this;
            if (index > 0) {
                setTimeout(function () {
                    //全部前进到最后一个点前的状态
                    $(one).animate({left: x1, top: y1}, 50);
                    $(one).animate({left: x2 > x1 ? x2 + x : x2 - x, top: y2 > y1 ? y2 + y : y2 - y}, 50);
                    $(one).animate({left: x2 > x1 ? x2 - x : x2 + x, top: y2 > y1 ? y2 - y : y2 + y}, 100);
                    $(one).animate({left: x2, top: y2}, 50);
                }.bind(one), index * 100);
            }
        });
        this.arr = [];
    },
    notDragMax: function () {//改变非拖拽时最大边界
        let it = this;
        this.checkCollapse();
        //屏幕最大内容
        this.WINDOWWIDTH = window.innerWidth;
        this.WINDOWHEIGHT = window.innerHeight;
        //屏幕有效大小
        this.STATICWIDTH = this.WINDOWWIDTH - this.ITEMWIDTH;
        this.STATICHEIGHT = this.WINDOWHEIGHT - this.ITEMHEIGHT;
        //父元素坐标
        this.FATHERX = this.$parent.offset().left;
        this.FATHERY = this.$parent.offset().top;
        if (this.firstTime) {
            this.firstTime = false;
            this.NOWX = this.STATICWIDTH - this.FATHERX - 10;
            this.NOWY = this.STATICHEIGHT - this.FATHERY - 10;
        }
        else {
            let x = this.$first.offset().left;
            let y = this.$first.offset().top;
            //left值计算
            if (this.STATICWIDTH > 0) {//还有空余距离
                if (x < this.STATICWIDTH) {
                    this.NOWX = x - this.FATHERX;
                }
                else {
                    this.NOWX = this.STATICWIDTH - this.FATHERX;
                }
            }
            else {
                this.NOWX = 0;
            }
            //top值计算
            if (this.STATICHEIGHT > 0) {//还有空余距离
                if (y < this.STATICHEIGHT) {
                    this.NOWY = y - this.FATHERY;
                }
                else {
                    this.NOWY = this.STATICHEIGHT - this.FATHERY;
                }
            }
            else {
                this.NOWY = 0;
            }
        }
        this.$parent.find('.item').each(function () {
            $(this).css({'left': it.NOWX, 'top': it.NOWY});
        });
    }
};