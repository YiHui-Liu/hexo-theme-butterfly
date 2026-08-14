/**
 * image.js v4 | https://volantis.js.org
 */

'use strict';

// {% image url %}
// {% image url, alt=haha %}
// {% image url, width=50% %}
// {% image url, height=32px %}
// {% image url, bg=#eee %}
// {% image url, alt=haha, width=400px %}
// {% image url, alt=haha, width=400px, bg=#eee %}

const { escapeHTML } = require('hexo-util');

function stripOuterP(html) {
    return html
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

hexo.extend.tag.register('image', function (args) {
    if (/::/g.test(args)) {
        args = args.join(' ').split('::');
    } else {
        args = args.join(' ').split(',');
    }

    const url = args[0].trim();
    let alt = '';
    let bg = '';
    let style = '';

    if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
            const tmp = args[i].trim();

            if (tmp.includes('alt=')) {
                alt = tmp.substring(4);
            } else if (tmp.includes('width=')) {
                style += 'width:' + tmp.substring(6) + ';';
            } else if (tmp.includes('height=')) {
                style += 'height:' + tmp.substring(7) + ';';
            } else if (tmp.includes('bg=')) {
                bg = tmp.substring(3);
            }
        }
    }

    const altText = escapeHTML(alt);
    const captionHTML = alt
        ? stripOuterP(hexo.render.renderSync({
            text: alt,
            engine: 'markdown'
        }))
        : '';

    let ret = '';
    ret += '<div class="img-wrap">';
    ret += '<div class="img-bg"';
    if (bg.length > 0) {
        ret += ' style="background:' + escapeHTML(bg) + '"';
    }
    ret += '>';

    ret += '<img class="lazyload lazyload-gif zooming" src="' + escapeHTML(url) + '"';
    if (alt.length > 0) {
        ret += ' alt="' + altText + '"';
    } else {
        ret += ' alt="image"';
    }
    if (style.length > 0) {
        ret += ' style="' + escapeHTML(style) + '"';
    }
    ret += '/>';

    ret += '</div>';
    if (alt.length > 0) {
        ret += '<span class="image-caption">' + captionHTML + '</span>';
    }
    ret += '</div>';
    return ret;
});
