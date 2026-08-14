function goMemos() {
    let id = document.getElementsByClassName("swiper-slide-active")[0].id;
    // pjax.loadUrl(`/memos/\#${id}`);
    location.href = `/memos/\#${id}`;
}

function initMemos() {
    if (document.querySelector('#memos-mini')) {
        let swiper = new Swiper('.swiper', {
            direction: 'vertical',
            loop: true,
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: true
            },
            enable: true,
        });
    }
}

function whenDOMReady() {
    initMemos();
    console.warn('memos_mini.js loaded');
};

var memosUrl = 'https://memos.foolishfox.cn';
var memosApi = `/api/v1/memos`
var memosPageSize = 10;
var memosFilter = `filter=visibility == "PUBLIC"&&"说说" in tags`
async function load_memos() {
    const response = await fetch(memosUrl + memosApi + `?pageSIze=${memosPageSize}&${memosFilter}`);
    const data = await response.json();
    const list = data.memos.slice(0, 10).map(item => {
        let data = item.content,
            content = data.replace(/#(.*?)\s|\n/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '').replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2">@$1</a>`).trim();
        type = data.match(/\!\[(.*?)\]\((.*?)\)/g) ? '[图片]' : data.match(/{\s*music\s*(.*?)\s*(.*?)\s*}/g) ? '[音乐]' : data.match(/{\s*player\s*(.*)\s*}/g) || data.match(/{\s*bilibili\s*(.*?)\s*}/g) ? '[视频]' : '';
        if (item.resources)
            type = '[图片]';
        return `<div class="li-style swiper-slide" id="${item.name.replace("/", "-")}">${content + type}</div>`
    });
    document.querySelector('#memos-mini').innerHTML = list.join(' ');
}

var html = `
    <div class="memos-mini wow animation-slide-in" data-wow-duration="1s" data-wow-delay="200ms" data-wow-offset="100" data-wow-iteration="1">
        <i class="iconfont icon-jike" title="即刻" onclick="goMemos()" style="font-size:1rem;margin-right:.5rem"></i>
        <div class="swiper swiper-no-swiping" id="memos" tabindex="-1" onclick="goMemos()">
            <div class="swiper-wrapper" id="memos-mini"><div class="li-style memos-loading" style="text-align: center">正在加载...</div></div>
        </div>
        <i class="iconfont icon-xiangyou" title="查看全文" onclick="goMemos()" style="margin-left:1rem"></i>
    </div>
`;
var container = document.getElementById("recent-posts");
if (container) {
    container.innerHTML = html + container.innerHTML;
    load_memos();
    // whenDOMReady();
    // document.addEventListener("pjax:complete", whenDOMReady);
    window.addEventListener("load", whenDOMReady);
}
