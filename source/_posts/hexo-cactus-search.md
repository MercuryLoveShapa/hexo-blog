---

title: hexo_cactus_search
date: 2022-04-05 14:38:52
tags: blog 
categories: 琐
description: -- hexo cactus 搜索模块
top_img: https://pic.imgdb.cn/item/629638960947543129d6c831.png
cover: https://pic.imgdb.cn/item/629638960947543129d6c831.png
copyright_author: CETACEAN
copyright_author_href: github.com/cetaceanMercuries
copyright_url: https://blog.cetacean.top/cerbot_nginx
copyright_info: FROM CETACEAN

---
### 过程

至于hexo怎么搭建hexo + github pages博客网上一堆就不讲了，由于搜索功能是调用hexo-generator-search生成xml数据，所以需要安装hexo-generator-search插件：

```
$ npm install --save hexo-generator-search
```



然后为hexo博客的配置文件_config.yml添加插件配置（注意：不是主题的配置文件）：

```
search:
  path: search.xml
  field: post
```



添加到search页面的导航：

```
nav:
  Home: /
  About: /about/
  Link: /link/
  Archives: /archives/
  Projects: https://github.com/sunnyelf
  Search: /search/
```



然后在`themes\cactus-dark\layout`文件夹下新建search.ejs文件，编写搜索框模板：

```
<section id="search">
    <span class="h1"><a href="#">Search</a></span>
    <form>
        <div class="row">
            <div class="col-xs-8 col-md-4">
                <input type="text" class="search-input" id="search-input" placeholder="search...">
            </div>
            <div class="col-xs-4 col-md-2">
                <button type="reset" class="reset-button" onclick="resetSearch()">reset</button>
            </div>
        </div>
        </form>
        <div id="search-result"></div>
        <p class='no-result'>No results found</p>
</section>
```



由于上面用到了flexboxgrid的CSS框架，所以需要在`C:\Users\Jing Ling\Documents\blog\themes\cactus-dark\layout\_partial\styles.ejs`文件引入：

```
<% if (page.layout === 'search') { %>
<link href="https://cdn.bootcss.com/flexboxgrid/6.3.1/flexboxgrid.min.css" rel="stylesheet">
<% } %>
```



，之后`\themes\cactus-dark\source\css\_partial`新建search.styl文件，编写搜索框样式：

```
.search-input
  font-size: 0.875rem
  height: 1.75rem
  border-width: 1px
  display: block
  font-family: inherit
  padding: 0.5rem
  width: 100%

.reset-button
  height: 1.75rem
  color: #fff
  background-color: #2bbc8a;
  padding: 0 16px
  font-size:.8em
  border:1px solid #2bbc8a;
  border-radius:2px;
  font-family: inherit
  font-weight: bold

#search-result ul.search-result-list {
  list-style-type:none;
  padding: 0px;
}

#search-result li {
  margin: 2em auto;
  border-bottom: 2px solid #2bbc8a;
}

#search-result .search-result-list li:hover {
  color:#eee
}

#search-result a.search-result-title {
  line-height: 1.2;
  font-weight: bold;
  color: #2bb48a;
}

#search-result p.search-result {
  margin: 0.4em auto;
  max-height: 13em;
  overflow: hidden;
  font-size: 0.8em;
  text-align: justify;
}

#search-result em.search-keyword {
  color: #f58e90;
  border-bottom: 1px dashed #f58e90;
  font-weight: bold;
  font-size: 0.85em;
}

p.no-result {
  display: none;
  padding-bottom: 0.5em;
  color: #eee;
  border-bottom: 2px solid #2bbc8a;
}
```



为了调用编写的样式需要在`\themes\cactus-dark\source\css\style.styl`样式文件添加`@import "_partial/search"`引入。
之后便是编写search.js处理hexo-generator-search生成索引数据search.xml：

```
// // A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// MIT License
// Copyright (C) 2015
// Joseph Pan <https://github.com/wzpan>
// Shuhao Mao <https://github.com/maoshuhao>
// MOxFIVE <https://github.com/MOxFIVE>
// Jing Ling <https://github.com/sunnyelf>
var searchFunc = function (path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function (xmlResponse) {
            // get the contents from search data
            var datas = $("entry", xmlResponse).map(function () {
                return {
                    title: $("title", this).text(),
                    content: $("content", this).text(),
                    url: $("url", this).text()
                };
            }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function () {
                var str = '<ul class=\"search-result-list\">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function (data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if (data_title != '' && data_content != '') {
                        keywords.forEach(function (keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if (index_title < 0 && index_content < 0) {
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li><a href='" + data_url + "' class='search-result-title' target='_blank'>" + "> " + data_title + "</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g, "");
                        if (first_occur >= 0) {
                            // cut out characters
                            var start = first_occur - 6;
                            var end = first_occur + 6;
                            if (start < 0) {
                                start = 0;
                            }
                            if (start == 0) {
                                end = 10;
                            }
                            if (end > content.length) {
                                end = content.length;
                            }
                            var match_content = content.substr(start, end);
                            // highlight all keywords
                            keywords.forEach(function (keyword) {
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
                            })
                            str += "<p class=\"search-result\">" + match_content + "...</p>"
                        }
                    }
                })
                $resultContent.innerHTML = str;
            })
        }
    })
}
var inputArea = document.querySelector("#search-input");
var $resultArea = $("#search-result");
inputArea.onfocus = function () {
    var path = "/search.xml";
    searchFunc(path, 'search-input', 'search-result');
}
inputArea.onkeydown = function () {
    if (event.keyCode == 13) {
        return false
    }
}
resetSearch = function () {
    $resultArea.html("");
    $(".no-result").hide();
}
$resultArea.bind("DOMNodeRemoved DOMNodeInserted", function (e) {
    if (!$(e.target).text()) {
        $(".no-result").show(200);
    } else {
        $(".no-result").hide();
    }
})
```



将search.js放入到`\themes\cactus-dark\source\js`文件夹下，为了调用js需要在`\themes\cactus-dark\layout\_partial\scripts.ejs`添加引入：

```
<% if (page.layout === 'search') { %>
    <%- js('js/search.js') %>
<% } %>
```



使用hexo命令新建search页面，`hexo new page search`，会生成`\source\search\index.md`，在index.md添加yaml标记,表示此页面渲染使用search模板：

```
---
layout: search
---
```



最后依此使用`hexo generate`和`hexo server`命令，访问`http://localhost:4000/search/`便可以进行搜索了。