// 运行计时
function createtime() {
    var now = new Date();
    calculate();
    function calculate() {
        var grt = new Date("03/30/2020 12:00:00");
        now.setTime(now.getTime() + 250);
        days = (now - grt) / 1000 / 60 / 60 / 24; dnum = Math.floor(days);
        hours = (now - grt) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours);
        if (String(hnum).length == 1) { hnum = "0" + hnum; } minutes = (now - grt) / 1000 / 60 - (24 * 60 * dnum) - (60 * hnum);
        mnum = Math.floor(minutes); if (String(mnum).length == 1) { mnum = "0" + mnum; }
        seconds = (now - grt) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
        snum = Math.round(seconds); if (String(snum).length == 1) { snum = "0" + snum; }
        document.getElementById("timeDate").innerHTML = "本站已运行 " + dnum + " 天 ";
        document.getElementById("times").innerHTML = hnum + " 小时 " + mnum + " 分 " + snum + " 秒";
    }
}
setInterval("createtime()", 250);

// 文章过期提醒
// function intervalTime(startTime, endTime){
//     var date1 = new Date(startTime);
//     var date2 = new Date(endTime);
//     var date3 = date2.getTime() - date1.getTime();
//     var days = Math.floor(date3 / (24 * 3600 * 1000));
//     return days;
// }
// function format(Date){
//     var Y = Date.getFullYear();
//     var M = Date.getMonth() + 1;
//     M = M < 10 ? '0' + M : M;
//     var D = Date.getDate();
//     D = D < 10 ? '0' + D : D;
//     return Y + '-' + M + '-' + D;
// }
// if (location.pathname.substr(1, 5) === 'posts') {
//     var createdAt = document.getElementsByClassName("post-meta-date-created")[0].innerHTML;
//     var updatedAt = document.getElementsByClassName("post-meta-date-updated")[0].innerHTML;
//     var now = format(new Date());
//     var cdays = intervalTime(createdAt, now);
//     var udays = intervalTime(updatedAt, now);
//     if ((cdays >= 90) && (udays >= 30))
//         var dom = document.getElementsByClassName('post-content')[0]
//         dom.innerHTML = "<div class=\"note warning flat\"><p>本文编写于" + cdays + "天前，最后修改于" + udays + "天前，其中某些信息可能已经过时。</p></div>" + dom.innerHTML;
// }

// 在特定日期变灰
if (aidaori()) {
    var dom = document.getElementsByTagName('html')[0];
    dom.style.cssText = `filter:gray !important;filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%) `;
    dom = document.getElementById('page-header');
    dom.style.cssText = `background-image: url(https://asset.foolishfox.cn/static/南京大屠杀.png);background-position: center;background-size: contain;background-repeat: no-repeat;background-color: white;`;
}

function aidaori() {
    // 1937年12月13日，南京大屠杀
    var aidaoriarr = new Array("1213");
    var mydate = new Date();
    var str = "";
    var mm = mydate.getMonth() + 1;
    if (mydate.getMonth() >= 9) str += mm;
    else str += "0" + mm;
    if (mydate.getDate() > 9) str += mydate.getDate();
    else str += "0" + mydate.getDate();
    if (aidaoriarr.indexOf(str) > -1) return 1;
    else return 0;
}
