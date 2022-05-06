
// 1 获取节点
var countdown = $('.hd_countdown strong');
//获取时分秒的节点
var hour = $('.hour');
var minute = $('.minute');
var second = $('.second');
function ji() {
    // 2 设置场数名称  8-10  8 点场   10-12 10点场  12-14 12点场.只有偶数场
    var nowDate = new Date();
    // 2-1 判断小时是否为偶数
    var h = nowDate.getHours();
    if (h % 2) {
        h--;
    }
    // 2-2 设置当前场数
    countdown.innerHTML = h + ':00 '
    // 3 计算设置时分秒倒计时

    // 3-1 设置结束时间
    var endTime = new Date();
    endTime.setHours(h + 2);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    //  console.log(endTime);

    // 3-2 计算当前时间和结束时间的差值
    var diff = (endTime - nowDate) / 1000;
    // console.log(diff);
    // 3-3 计算小时,分钟,秒数

    var tmpH = parseInt(diff / 60 / 60);
    var tmpM = parseInt((diff / 60) % 60);
    var tmpS = parseInt(diff % 60);
    // console.log(tmpH, tmpM, tmpS);

    // 3-4 设置到页面中
    hour.innerHTML = '0' + tmpH;
    minute.innerHTML = tmpM < 10 ? '0' + tmpM : tmpM;
    second.innerHTML = tmpS < 10 ? '0' + tmpS : tmpS;

}
ji();
setInterval(ji, 1000)







// 获取节点的方法
function $(tag) {
    return document.querySelector(tag)
}