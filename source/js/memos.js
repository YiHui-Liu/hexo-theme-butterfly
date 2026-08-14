var memosUrl = 'https://memos.foolishfox.cn';
var memosApi = `/api/v1/memos`
var memosPageSize = 10;
var memosPageToken = null;
var memosFilter = `filter=visibility == "PUBLIC"&&"说说" in tags`
loadMemos();
document.getElementById("page").style.paddingTop = "10px";
// 加载
function loadMemos() {
    if (memosPageToken === "") {
        btn = document.getElementById("memos-load-more");
        btn.innerHTML = "没有更多了";
        btn.disabled = true;
    } else {
        let url = memosUrl + memosApi + `?pageSize=${memosPageSize}&${memosFilter}`;
        if (memosPageToken) {
            url += `&pageToken=${memosPageToken}`;
        }
        fetch(url).then(res => res.json()).then(data => { // 注意修改域名和用户id
            let items = [],
                html = [],
                icon = '<svg viewBox="0 0 512 512"xmlns="http://www.w3.org/2000/svg"class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"fill="#1da1f2"></path></svg>';
            data.memos.forEach(item => { items.push(Format(item)) });
            items.forEach(item => {
                let location = item.location ? `<a class="memos-location" href="${escapeHtml(item.location.url)}" target="_blank" rel="noopener noreferrer" title="在高德地图中查看 ${escapeHtml(item.location.name)}"><i class="fa-solid fa-location-dot fa-fw"></i>${escapeHtml(item.location.name)}</a>` : '';
                html.push(`<div class="memos-item" id="${item.id}"><div class="memos-meta"><img class="no-lightbox no-lazyload memos-avatar" src="https://asset.foolishfox.cn/static/avatar.jpg"><div class="memos-info"><span class="memos-nick">Fox${icon}</span><span class="memos-date">${item.date}</span></div></div><div class="memos-content">${item.content}</div><div class="memos-bottom"><div><span class="memos-tag">#${item.tag}</span>${location}</div><a href="javascript:;"onclick="goComment('${item.text}', '${item.id}')"><span class="icon"><i class="fa-solid fa-message fa-fw"></i></span></a></div></div>`)
            });
            html = html.join('<hr class="memos-hr">');
            if (memosPageToken) {
                document.getElementById('memos_container').innerHTML += '<hr class="memos-hr">' + html;
                window.lazyLoadInstance && window.lazyLoadInstance.update();
            } else {
                document.getElementById('memos_container').innerHTML = html;
                document.getElementById('memos').innerHTML += `<button id="memos-load-more" onclick="loadMemos()">加载更多</button>`;
            }
            memosPageToken = data.nextPageToken;
        });
    }
}
// 页面评论
function goComment(e, id) {
    console.log(e, n);
    var n = document.querySelector("#wl-edit");
    n.value = '> ' + e.replace(/\n/g, '\n> ') + `\n> ref: <a href="#${id}">${id}</a>` + '\n\n';
    n.focus();
    btf.snackbarShow("无需删除空行，直接输入评论即可", !1, 2e3);
}
// 页面内容格式化
function Format(item) {
    let date = getTime(item.createTime);
    let content = item.content;
    let tag = item.content.match(/#说说\/(.*)/g) || [];
    let imgs = content.match(/!\[.*\]\(.*?\)/g);
    let text = '';
    if (imgs) imgs = imgs.map(item => { return item.replace(/!\[.*\]\((.*?)\)/, '$1') });
    const attachments = item.attachments || item.resources || [];
    if (attachments.length) {
        if (!imgs) imgs = [];
        attachments.forEach(t => {
            if (t.externalLink) imgs.push(t.externalLink);
            else imgs.push(`${memosUrl}/file/${t.name}/${encodeURIComponent(t.filename)}`);
        });
    }
    text = content.replace(/#(.*?)\s/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '');
    content = text.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2">@$1</a>`);
    text = text.replace(/\n/g, "\\n");
    content = content.trim().replace(/\n/g, `<br>`);
    if (imgs) {
        content += `<div class="memo_img">`;
        imgs.forEach(e => {
            u = new URL(e);
            e = "https://asset.foolishfox.cn" + u.pathname;
            content += `<a href="${e}" data-fancybox="gallery" class="fancybox" data-thumb="${e}"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-lazy-src="${e}"></a>`
        });
        content += '</div>';
    }
    let items = [];
    tag.forEach(item => {
        item.trim().split(" ").forEach(t => {
            items.push(t.slice(4, t.length));
        });
    });
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '[链接]' + `${imgs ? '[图片]' : ''}`);
    if (imgs) text += `[图片]`;
    return {
        id: item.name.replace("/", "-"),
        content: content,
        tag: items.length ? items.join(" #") : '无标签',
        date: date,
        text: text,
        location: formatLocation(item.location)
    }
}
// 高德 Marker URI 原生支持 WGS84，可精确标记 Memos 提供的原始坐标。
function formatLocation(location) {
    if (!location || typeof location !== 'object') return null;
    if (location.latitude == null || location.longitude == null) return null;

    let latitude = Number(location.latitude);
    let longitude = Number(location.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;

    let name = String(location.placeholder || '查看位置').trim() || '查看位置';
    let params = new URLSearchParams({
        position: `${longitude},${latitude}`,
        name: name,
        coordinate: 'wgs84',
        callnative: '0',
        src: 'FoolishFox Blog'
    });
    return {
        name: name,
        url: `https://uri.amap.com/marker?${params}`
    };
}
// Memos 的位置名称来自接口，插入 HTML 前需转义。
function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[char]);
}
// 页面时间格式化
function getTime(time) {
    let d = new Date(time),
        ls = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for (let i = 0; i < ls.length; i++) {
        ls[i] = ls[i] <= 9 ? '0' + ls[i] : ls[i] + '';
    }
    return ls[0] + '年' + ls[1] + '月' + ls[2] + '日 ' + ls[3] + ':' + ls[4];
}
