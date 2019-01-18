//屏幕宽高
function getWidth() {
    return document.body.clientWidth;
}

function getHeight() {
    return window.innerHeight;
}

function SmallBall() {
    this.x = Math.random() * getWidth();
    this.y = Math.random() * getHeight();
    this.r = Math.random() * 5 + 5;
    this.c = "rgba(" + this.cR() + "," + this.cR() + "," + this.cR() + ",.6)";

    this.tempY = this.y;
    this.offsetY = (Math.random() + 0.2) / 3;
    this.upStatus = true;
}

//获取0-255的整数
SmallBall.prototype.cR = function () {
    return Math.floor(Math.random() * 127 + 128);
}

//运动函数
SmallBall.prototype.animate = function () {
    var upStatus = this.upStatus,
        offsetY = this.offsetY;

    if (upStatus) {
        this.y -= offsetY;
        if ((this.tempY - this.y) >= 20) {
            this.upStatus = !this.upStatus;
        }
    } else {
        this.y += offsetY;
        if ((this.tempY - this.y) <= -20) {
            this.upStatus = !this.upStatus;
        }
    }
}

function Ball(cvs, options) {
    this.canvas = document.querySelector(cvs);
    this.ctx = this.canvas.getContext('2d');
    this.balls = [];
    this.options = options || {};
    this.num = this.options.num || 50;

    this.init();
    this.play();
}

//初始化
Ball.prototype.init = function () {
    this.canvas.width = this.options.width || getWidth();
    this.canvas.height = this.options.height || getHeight();

    var balls = this.balls;

    for (var i = 0; i < this.num; i++) {
        balls[i] = new SmallBall();
        this.draw(balls[i]);
    }
}

//画布执行动画逻辑
Ball.prototype.play = function () {
    var ctrl = this,
        balls = this.balls;

    function run() {
        ctrl.ctx.clearRect(0, 0, ctrl.canvas.width, ctrl.canvas.height);
        for (var i = 0; i < ctrl.num; i++) {
            balls[i].animate();
            ctrl.draw(balls[i]);
        }
        window.requestAnimationFrame(run);
    }
    window.requestAnimationFrame(run);
}

//画球
Ball.prototype.draw = function (ball) {
    var x = ball.x,
        y = ball.y,
        r = ball.r,
        c = ball.c;
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
}