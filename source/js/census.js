// 访问日历
let maxDays = 180; // 最多显示天数

function generatePieces(maxValue, colorBox) {
    var pieces = [];
    var quotient = 1;
    var temp = { 'lt': 1, 'label': '0', 'color': colorBox[0] };
    pieces.push(temp);

    if (maxValue && maxValue >= 10) {
        quotient = Math.floor(maxValue / 10) + 1;
        for (var i = 1; i <= 10; i++) {
            var temp = {};
            if (i == 1) temp.gte = 1;
            else temp.gte = quotient * (i - 1);
            temp.lte = quotient * i;
            temp.color = colorBox[i];
            pieces.push(temp);
        }
    }
    return JSON.stringify(pieces);
}

function append_div_visitcalendar(parent, text) {
    if (parent !== null) {
        if (typeof text === 'string') {
            var temp = document.createElement('div');
            temp.innerHTML = text;
            var frag = document.createDocumentFragment();
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            parent.appendChild(frag);
        } else {
            parent.appendChild(text);
        }
    }
};

function compareFunction(propertyName) {
    return function (o1, o2) {
        //获取比较的值
        var v1 = o1[propertyName];
        var v2 = o2[propertyName];
        return v1 > v2 ? 1 : (v1 == v2 ? 0 : -1);
    };
}


function filterTime(time) {
    const date = new Date(time)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
    return `${Y}-${M}-${D}`
}

function calChartFunc() {
    let script = document.createElement("script");

    let now = new Date();
    let date = new Date();
    date.setFullYear(now.getFullYear() - 1);
    let endAt = now.getTime();
    let startAt = date.getTime() - 3600 * 24 * ((date.getDay() + 1) % 7);
    if (startAt < endAt - maxDays * 86400 * 1000) startAt = endAt - maxDays * 86400 * 1000;

    fetch('https://api.foolishfox.cn/umami/day_view?startAt=' + startAt + '&endAt=' + endAt).then(data => data.json()).then(data => {
        data = data.pageviews;
        data.sort(compareFunction("x"));

        let calArr = [];
        let maxValue = 0, total = 0, weekdatacore = 0, monthdatacore = 0;
        let colorBox = ['#EBEDF0', '#FFE9BB', '#FFD1A7', '#FFBB95', '#FFA383', '#FF8D70', '#FF745C', '#FF5C4A', '#FF4638', '#FF2E26', '#FF1812'];
        for (let i = 0; i < data.length; i++) {
            if (i > 0) {
                let pre = new Date(data[i - 1].x.replace(/-/g, "/"));
                let tmp = new Date(data[i].x.replace(/-/g, "/"));
                if (tmp.getTime() - pre.getTime() != 86400 * 1000)
                    for (let k = 1; k < (tmp.getTime() - pre.getTime()) / (86400 * 1000); k++) {
                        tmp = new Date(pre.getTime() + 86400 * 1000 * k);
                        calArr.push([filterTime(tmp).slice(0, 10), 0]);
                    }
            }

            calArr.push([data[i].x.slice(0, 10), data[i].y]);
            maxValue = data[i].y > maxValue ? data[i].y : maxValue;
            total += data[i].y;
        }
        if (calArr[calArr.length - 1][0] != filterTime(now)) calArr.push([filterTime(now), 0]);

        for (let i = calArr.length - 1; i >= calArr.length - 7; i--)   weekdatacore += calArr[i][1];
        for (let i = calArr.length - 1; i >= calArr.length - 30; i--)   monthdatacore += calArr[i][1];
        let calArrJson = JSON.stringify(calArr);
        script.innerHTML = `
        var calChart = echarts.init(document.getElementById("calendar_container"));
        var option = {
            title: { text: '访问日历', x: 'center' },
            tooltip: {
                padding: 10,
                backgroundColor: '#555',
                borderColor: '#777',
                borderWidth: 1,
                textStyle: { color: '#fff' },
                formatter: function (obj) {
                    var value = obj.value;
                    return '<div style="font-size: 14px;">' + value[0] + ': ' + value[1] + '</div>';
                }
            },
            visualMap: {
                show: false,
                showLabel: true,
                min: 0,
                max: ${maxValue},
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                pieces: ${generatePieces(maxValue, colorBox)}
            },
            calendar: [{
                left: 'center',
                range: ['${calArr[0][0]}', '${calArr[calArr.length - 1][0]}'],
                cellSize: [14, 14],
                splitLine: {
                    show: false
                },
                itemStyle: {
                    color: '#ebedf0',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                yearLabel: {
                    show: false
                },
                monthLabel: {
                    nameMap: 'cn',
                    fontSize: 11
                },
                dayLabel: {
                    formatter: '{start}  1st',
                    nameMap: 'cn',
                    fontSize: 11
                }
            }],
            series: [{
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 0,
                data: ${calArrJson},
            }]
        };
        calChart.setOption(option);`;
        let style = '<style>.number{margin-top: 10px;text-align:center;width:100%;padding:10px;margin:0 auto;}.contrib-column{text-align:center;border-left:1px solid #ddd;border-top:1px solid #ddd;}.contrib-column-first{border-left:0;}.table-column{padding:10px;display:table-cell;flex:1;vertical-align:top;}.contrib-number{font-weight:400;line-height:1.3em;font-size:24px;display:block;}.left.text-muted{float:left;margin-left:9px;color:#767676;}.left.text-muted a{color:#4078c0;text-decoration:none;}.left.text-muted a:hover{text-decoration:underline;}h2.f4.text-normal.mb-3{display:none;}.float-left.text-gray{float:left;}.position-relative{width:100%;}@media screen and (max-width:650px){.contrib-column{display:none}}</style>';
        style = '<div style="display:flex;width:100%" class="number"><div class="contrib-column contrib-column-first table-column"><span class="text-muted">过去' + maxDays + '天访问</span><span class="contrib-number">' + total + '</span><span class="text-muted">' + calArr[0][0] + '&nbsp;-&nbsp;' + calArr[calArr.length - 1][0] + '</span></div><div class="contrib-column table-column"><span class="text-muted">最近30天访问</span><span class="contrib-number">' + monthdatacore + '</span><span class="text-muted">' + calArr[calArr.length - 30][0] + '&nbsp;-&nbsp;' + calArr[calArr.length - 1][0] + '</span></div><div class="contrib-column table-column"><span class="text-muted">最近7天访问</span><span class="contrib-number">' + weekdatacore + '</span><span class="text-muted">' + calArr[calArr.length - 7][0] + '&nbsp;-&nbsp;' + calArr[calArr.length - 1][0] + '</span></div></div>' + style;

        document.getElementById("calendar_container").after(script);
        append_div_visitcalendar(calendar_container, style);
    }).catch(function (error) {
        console.log(error);
    });
}

// 访问地图
function mapChartFunc() {
    let script = document.createElement("script");

    let now = new Date();
    let date = new Date();
    date.setFullYear(2021, 9, 1);
    let startAt = date.getTime();
    let endAt = now.getTime();

    fetch('https://api.foolishfox.cn/umami/country?startAt=' + startAt + '&endAt=' + endAt).then(data => data.json()).then(data => {
        let mapArr = [];
        let maxValue = 0;
        for (let i = 0; i < data.length; i++) {
            maxValue = data[i].y > maxValue ? data[i].y : maxValue;
            mapArr.push({ name: data[i].x, value: data[i].y });
        }
        let mapArrJson = JSON.stringify(mapArr);
        script.innerHTML = `
        let processedData = ${mapArrJson}.map(item => {
            const safeValue = Math.max(1, item.value);
            return {
                name: item.name,
                value: Math.log10(safeValue),
                origin: safeValue
            };
        });
        var mapChart = echarts.init(document.getElementById('map_container'), 'light');
        var mapOption = {
            title: { text: '访问地点(按人数记)', x: 'center' },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (params.data && params.data.origin !== undefined)
                        return params.name + ': ' + params.data.origin;
                    return params.name;
                }
            },
            visualMap: {
                min: 0,
                max: Math.log10(${maxValue}),
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                calculable: true,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                },
                formatter: (value) => Math.round(Math.pow(10, value)),
            },
            series: [{
                name: '访问人数',
                type: 'map',
                mapType: 'world',
                showLegendSymbol: false,
                label: {
                    emphasis: { show: false }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#121212'
                    },
                    emphasis: { areaColor: 'gold' }
                },
                data: processedData
            }]
        };
        mapChart.setOption(mapOption);`;
        document.getElementById('map_container').after(script);
    }).catch(function (error) {
        console.log(error);
    });
}

function get_year(s) {
    return parseInt(s.substr(0, 4));
}
function get_month(s) {
    return parseInt(s.substr(5, 2));
}

// 访问趋势
function trendsChartFunc() {
    let script = document.createElement("script");

    let now = new Date();
    let date = new Date();
    date.setFullYear(2021, 9, 1);
    let startAt = date.getTime();
    let endAt = now.getTime();

    fetch('https://api.foolishfox.cn/umami/month_view?startAt=' + startAt + '&endAt=' + endAt).then(data => data.json()).then(data => {
        data = data.pageviews;

        let date = new Date();
        let monthValueArr = {};
        for (let i = 2020; i <= date.getFullYear(); i++)   monthValueArr[String(i)] = [, , , , , , , , , , ,];
        for (let i = 0; i < data.length; i++) {
            let year = get_year(data[i].x);
            let month = get_month(data[i].x);
            monthValueArr[String(year)][String(month - 1)] = data[i].y;
        }
        script.innerHTML = `
        var trendsChart = echarts.init(document.getElementById('trends_container'), 'light');
        var trendsOption = {
            title: { text: '访问趋势', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['2021', '2022', '2023', '2024', '2025', '2026'], x: 'right' },
            xAxis: {
                name: '日期', type: 'category', boundaryGap: false,
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: { type: 'log', name: '访问次数' },
            series: [
                {
                    name: '2021', type: 'line', smooth: true,
                    data: [654,865,334,769,866,673,659,981,518,${monthValueArr["2021"][9]},${monthValueArr["2021"][10]},${monthValueArr["2021"][11]}],
                },
                {
                    name: '2022', type: 'line', smooth: true,
                    data: [${monthValueArr["2022"]}],
                },
                {
                    name: '2023', type: 'line', smooth: true,
                    data: [${monthValueArr["2023"]}],
                },
                {
                    name: '2024', type: 'line', smooth: true,
                    data: [${monthValueArr["2024"]}],
                },
                {
                    name: '2025', type: 'line', smooth: true,
                    data: [${monthValueArr["2025"]}],
                },
                {
                    name: '2026', type: 'line', smooth: true,
                    data: [${monthValueArr["2026"]}],
                }
            ]
        };
        trendsChart.setOption(trendsOption);`;
        document.getElementById('trends_container').after(script);
    }).catch(function (error) {
        console.log(error);
    });
}

// 访问来源
function sourcesChartFunc() {
    let script = document.createElement("script");
    var link = 0, direct = 0, search = 0;
    var google = 0, baidu = 0, bing = 0;
    var github = 0, travel = 0, weibo = 0;

    let now = new Date();
    let date = new Date();
    date.setFullYear(2021, 9, 1);
    let startAt = date.getTime();
    let endAt = now.getTime();

    fetch('https://api.foolishfox.cn/umami/referrer?startAt=' + startAt + '&endAt=' + endAt).then(data => data.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
            var ref = data[i].x;
            if (ref == "direct") direct = data[i].y;
            else if (ref.includes("localhost") || ref.includes("127.0.0.1") || ref.includes("foolishfox.cn")) direct -= data[i].y;
            else if (ref.includes("bing.com")) bing += data[i].y;
            else if (ref.includes("baidu.com")) baidu += data[i].y;
            else if (ref.includes("google.com")) google += data[i].y;
            else if (ref.includes("sogou.com") || ref.includes("sm.cn") || ref.includes("toutiao.com") || ref.includes("so.com") || ref.includes("quark.cn"))
                search += data[i].y
            else if (ref.includes("github.com")) github += data[i].y;
            else if (ref.includes("travellings") || ref.includes("foreverblog")) travel += data[i].y;
            else if (ref.includes("weibo.cn")) weibo += data[i].y;
            else link += data[i].y
        }

        link += github + travel + weibo;
        search += baidu + google + bing;
        script.innerHTML += `
        var sourcesChart = echarts.init(document.getElementById('sources_container'), 'light');
        var sourcesOption = {
            title: { text: '访客来源', x: 'center', },
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            legend: {
                data: ['直达', '外链', '搜索', '百度', '谷歌', '必应', 'Github', '开往/十年之约', '微博'],
                y: 'bottom'
            },
            series: [
                {
                    name: '来源明细', type: 'pie', radius: ['45%', '60%'],
                    labelLine: { length: 30 },
                    label: {
                        formatter: '{a|{a}}{abg|}\\n{hr|}\\n  {b|{b}: }{c}  {per|{d}%}  ',
                        backgroundColor: '#F6F8FC', borderColor: '#8C8D8E',
                        borderWidth: 1, borderRadius: 4,
                        rich: {
                            a: { color: '#6E7079', lineHeight: 22, align: 'center' },
                            hr: { borderColor: '#8C8D8E', width: '100%', borderWidth: 1, height: 0 },
                            b: { color: '#4C5058', fontSize: 14, fontWeight: 'bold', lineHeight: 33 },
                            per: { color: '#fff', backgroundColor: '#4C5058', padding: [3, 4], borderRadius: 4 }
                        }
                    },
                    data: [
                        {value: ${search - google - baidu - bing}, name: '其他', itemStyle: { color : '#008000' }},
                        {value: ${google}, name: '谷歌', itemStyle: { color : '#009000' }},
                        {value: ${baidu}, name: '百度', itemStyle: { color : '#00A000' }},
                        {value: ${bing}, name: '必应', itemStyle: { color : '#00B000' }},
                        {value: ${direct}, name: '直达', itemStyle: { color : '#FFDB5C' }},
                        {value: ${github}, name: 'Github', itemStyle: { color : '#87CEFA' }},
                        {value: ${weibo}, name: '微博', itemStyle: { color : '#00BFFF' }},
                        {value: ${travel}, name: '开往/十年之约', itemStyle: { color : '#1E90FF' }},
                        {value: ${link - github - travel - weibo}, name: '其他', itemStyle: { color : '#4682B4' }}
                    ]
                },
                {
                    name: '访问来源', type: 'pie', selectedMode: 'single', radius: [0, '30%'],
                    label: { position: 'inner', fontSize: 14},
                    labelLine: { show: false },
                    data: [
                        {value: ${search}, name: '搜索', itemStyle: { color : '#008000' }},
                        {value: ${direct}, name: '直达', itemStyle: { color : '#FFDB5C' }},
                        {value: ${link}, name: '外链', itemStyle: { color : '#4682B4' }}
                    ]
                },
            ]
        };
        sourcesChart.setOption(sourcesOption);
        window.addEventListener("resize", () => { 
            calChart.resize();
            mapChart.resize();
            trendsChart.resize();
            sourcesChart.resize();
        });`;
    }).catch(function (error) {
        console.log(error);
    });
    document.getElementById('sources_container').after(script);
}

if (document.getElementById("calendar_container")) calChartFunc();
if (document.getElementById('map_container')) mapChartFunc();
if (document.getElementById('trends_container')) trendsChartFunc();
if (document.getElementById('sources_container')) sourcesChartFunc();
