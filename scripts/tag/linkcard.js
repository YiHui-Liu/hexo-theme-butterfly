'use strict'

var pathFn = require('path')
var fs = require('hexo-fs')

function linkcard (args) {
  var path = pathFn.join(hexo.source_dir, args[0])

  fs.exists(path).then(function (exist) {
    if (!exist) {
      hexo.log.error('Include file not found!')
    }
  })

  return fs.readFile(path).then(function (data) {
    if (!data) {
      hexo.log.warn('Include file empty.')
      return
    }

    var imgClassName = 'linkcard-plugin__item-avatar '
    var theme = hexo.theme.config
    if (theme.lazyload && theme.lazyload.enable) {
      imgClassName += `lazyload lazyload-${theme.lazyload.placeholder}`
    }

    var linkcards = JSON.parse(data)
    var renderHtml = '<div class="linkcard-plugin">'
    linkcards.forEach(f => {
      renderHtml +=
        `<a class="linkcard-plugin__item" href="${f.url}">` +
        `<img class="${imgClassName}" src="${f.avatar}" data-zoom="none">` +
        '<div class="linkcard-plugin__item-info">' +
        `<p class="linkcard-plugin__item-info__name" title="${f.name}">${f.name}</p>` +
        `<p class="linkcard-plugin__item-info__intro" title="${f.introduction}">${f.introduction}</p>` +
        '</div>' +
        '</a>'
    })
    renderHtml += '</div>'

    return renderHtml
  })
}

hexo.extend.tag.register('linkcard', linkcard, { ends: false, async: true })
