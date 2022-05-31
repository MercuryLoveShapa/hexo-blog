/**
 * Butterfly
 * 1. Merge CDN
 * 2. Capitalize the first letter of comment name
 */

'use strict'

const { version } = require('../../package.json')
const path = require('path')

hexo.extend.filter.register('before_generate', () => {
  const themeConfig = hexo.theme.config
  const { CDN, comments } = themeConfig

  /**
   * Merge CDN
   */

  const internalSrcCDN = {
    main_css: '/css/index.css',
    main: `https://cdn.jsdelivr.net/npm/hexo-theme-butterfly@${version}/source/js/main.min.js`,
    utils: `https://cdn.jsdelivr.net/npm/hexo-theme-butterfly@${version}/source/js/utils.min.js`,
    translate: `https://cdn.jsdelivr.net/npm/hexo-theme-butterfly@${version}/source/js/tw_cn.min.js`,
    local_search: `https://cdn.jsdelivr.net/npm/hexo-theme-butterfly@${version}/source/js/search/local-search.min.js`,
    algolia_js: `https://cdn.jsdelivr.net/npm/hexo-theme-butterfly@${version}/source/js/search/algolia.min.js`,
  }

  const internalSrcLocal = {
    main_css: '/css/index.css',
    main: '/js/main.js',
    utils: '/js/utils.js',
    translate: '/js/tw_cn.js',
    local_search: '/js/search/local-search.js',
    algolia_js: '/js/search/algolia.js',
  }

  const thirdPartySrcCDN = {
    algolia_search_v4: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/algoliasearch/4.12.1/algoliasearch-lite.umd.min.js',
    instantsearch_v4: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/instantsearch.js/4.39.0/instantsearch.production.min.js',
    pjax: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/Pjax-Standalone/0.6.0/pjax-standalone.min.js',
    gitalk: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/gitalk/1.7.2/gitalk.min.js',
    gitalk_css: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/gitalk/1.7.2/gitalk.min.css',
    blueimp_md5: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/blueimp-md5/2.19.0/js/md5.min.js',
    valine: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/valine/1.4.16/Valine.min.js',
    disqusjs: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/disqusjs/1.3.0/disqus.min.js',
    disqusjs_css: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/disqusjs/1.3.0/disqusjs.min.css',
    twikoo: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/twikoo/1.4.18/twikoo.all.min.js',
    waline_js: 'https://unpkg.com/@waline/client@v2/dist/waline.js',
    // ---
    waline_css: 'https://unpkg.com/@waline/client@v2/dist/waline.css',
    // ---
    sharejs: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/social-share.js/1.0.16/js/social-share.min.js',
    sharejs_css: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/social-share.js/1.0.16/css/share.min.css',
    mathjax: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/mathjax/3.2.0/es5/tex-mml-chtml.js',
    katex: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css',
    katex_copytex: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/contrib/copy-tex.min.js',
    katex_copytex_css: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/contrib/copy-tex.css',
    mermaid: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/mermaid/8.14.0/mermaid.min.js',
    // ---
    canvas_ribbon: '/js/butterfly/canvas-ribbon.min.js',
    canvas_fluttering_ribbon: '/js/butterfly/canvas-fluttering-ribbon.min.js',
    canvas_nest: '/js/butterfly/canvas-nest.min.js',
    activate_power_mode: '/js/butterfly/activate-power-mode.min.js',
    fireworks: '/js/butterfly/fireworks.min.js',
    click_heart: '/js/butterfly/click-heart.min.js',
    ClickShowText: '/js/butterfly/click-show-text.min.js',
    // ---
    lazyload: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vanilla-lazyload/17.3.1/lazyload.iife.min.js',
    instantpage: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/instant.page/5.1.0/instantpage.min.js',
    typed: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/typed.js/2.0.12/typed.min.js',
    pangu: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/pangu/4.0.7/pangu.min.js',
    fancybox_css_v4: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/fancybox/3.5.7/jquery.fancybox.css',
    fancybox_v4: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/fancybox/3.5.7/jquery.fancybox.min.js',
    medium_zoom: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/medium-zoom/1.0.6/medium-zoom.min.js',
    snackbar_css: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/snackbarjs/1.1.0/snackbar.min.css',
    snackbar: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/snackbarjs/1.1.0/snackbar.min.js',
    fontawesomeV6: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.min.css',
    flickr_justified_gallery_js: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/justifiedGallery/3.8.1/js/jquery.justifiedGallery.min.js',
    flickr_justified_gallery_css: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/justifiedGallery/3.8.1/css/justifiedGallery.min.css',
    aplayer_css: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css',
    aplayer_js: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js',
    // --
    meting_js: 'https://unpkg.com/meting@2.0.1/dist/Meting.min.js',
    // --
    prismjs_js: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/9000.0.1/prism.min.js',
    prismjs_lineNumber_js: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/9000.0.1/plugins/line-numbers/prism-line-numbers.min.js',
    prismjs_autoloader: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.27.0/plugins/autoloader/prism-autoloader.min.js',
  }

  // delete null value
  const deleteNullValue = obj => {
    if (!obj) return
    for (const i in obj) {
      obj[i] === null && delete obj[i]
    }
    return obj
  }

  const defaultVal = (obj, choose) => {
    if (obj === 'internal') {
      if (choose === 'local') return internalSrcLocal
      else return internalSrcCDN
    }

    if (obj === 'external') {
      if (choose === 'local') {
        let result = {}
        try {
          const data = path.join(hexo.plugin_dir,'hexo-butterfly-extjs/plugins.yml')
          result = hexo.render.renderSync({ path: data, engine: 'yaml'})
          Object.keys(result).map(key => {
            result[key] = '/pluginsSrc/' + result[key]
          })
        } catch (e) {}
        return result
      } else return thirdPartySrcCDN
    }
  }

  themeConfig.asset = Object.assign(defaultVal('internal', CDN.internal_provider),
    defaultVal('external', CDN.third_party_provider), deleteNullValue(CDN.option))

  /**
   * Capitalize the first letter of comment name
   */

  let { use } = comments

  if (!use) return

  if (typeof use === 'string') {
    use = use.split(',')
  }

  const newArray = use.map(item => item.toLowerCase().replace(/\b[a-z]/g, s => s.toUpperCase()))

  themeConfig.comments.use = newArray
})
