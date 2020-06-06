---
title: About what this blog is made of
date: 2016-01-23
layout: post.html
collection: posts
tags: blog
---

Stack
---

This website is statically generated with [Metalsmith](https://metalsmith.io/) framework, which is written in JavaScript. This is imposrtant, since I don't know much Ruby and know much JS. It works with very simple idea:

> All of the logic in Metalsmith is handled by plugins. You simply chain them together.

So, in a sense it reminds how [Gulp](http://gulpjs.com/) works. Each plugin is just a transformer for stream of files (usually your blog content and pages) and metadata store. A plugin can modify anything in this stream. For more details consult with Metalsmith website.

It is my second choice. At first I tried [Hexo](https://hexo.io/). It was nice, but something went wrong. I've made a mistake not writing down what was the reason of rejecting it and now I can't recall.

As for design/theme I was planning to use some of the many open source themes out there. Since most popular engine is [Jekyll](https://jekyllrb.com/) it also has most of the themes. This was the driving force in choosing templating engine. Current chosen theme is [lanyon](http://lanyon.getpoole.com/).

For templating I use [Nunjucks](http://mozilla.github.io/nunjucks/) template engine from Mozilla in conjuction with [Consolidate](https://github.com/tj/consolidate.js/). Even thought [TinyLiquid](https://github.com/leizongmin/tinyliquid) engine suppose to be JS reincarnation of [liquid](http://liquidmarkup.org/) (which is in the heart of Jekyll, for some reason it didn't worked well with Jekyll templates.

The current list of blog features is the following:

-   Blog posts
-   Pages with a link in the sidebar on the left
-   Simplest pagination with back and forth links
-   Simple Tags system

Things I still need to add:

-   Ability to comment on posts and pages

Tags solution
-------------

After rejecting seemingly overcomplicated (and not maintained) [plugin](https://github.com/totocaster/metalsmith-tags), I've end up writing my own solution. It consists of three parts. First you want to specify tags on each blog post or a page.

```
title: First page in this blog/site/whatever
layout: post.html
collection: posts
tags: blog howto

```

Second we need to parse all the pages and posts (files) and do two things:

-   convert `tags` to an array, so when we need this on the page we can iterate it
-   save `<tag name>: [<page>, <page>]` mapping into the metadata store

```js
function (files, metalsmith, done) {
    var tags = {};
    _.each(files, function (file) {
        if (!file.tags) { return }
        file.tags = file.tags.split(' ');
        file.tags.forEach(function (tag) {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(file);
        });
    });
    metalsmith.metadata().tags = tags;
    done();
};

```

And a Third we need to make use of these two things we've added to the data stream:

-   display list of tags on the page itself
{% raw %}
```twig
    Tags:
    {% for tag in tags %}
        <a href="{{site.baseurl}}/tags#tag-{{tag}}">{{tag}}</a>
    {% endfor %}
```
{% endraw %}

-   make a separate page for tags with own layout:
{% raw %}
    ```twig
    <div class="page">
      <h1 class="page-title">{{ title }}</h1>
      {% for tagName, pages in tags %}
          <span id="tag-{{tagName}}">{{tagName}}</span>:
          {% for page in pages %}
              <a href="{{ page.path }}">{{page.title}}</a>
          {% endfor %}
          <br/>
      {% endfor %}
    </div>
    ```
{% endraw %}

