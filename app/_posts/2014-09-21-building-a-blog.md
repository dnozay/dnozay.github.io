---
layout: post
title:  "Building a blog on github. part 1."
date: '2014-09-21 15:37:38'
categories: howto
---

I knew GitHub provided hosting for project documentation and I did use it in
the past with content that I manually wrote, but that's a lot of moving pieces.
Thing is, I'm not a front-end engineer and while `css`, `html` and `javascript`
are not foreign to me, it's not something I do all day long, my day job
involves `python`, databases, backends and infrastructure.

## Enter github pages.

> Okay, so where do we start?

GitHub makes it easy, you can go to <https://pages.github.com/> and they will
take you through very simple steps to get static pages working. The only part
that was confusing for me is that for user pages (`username.github.io`) you
need to use the `master` branch whereas for project pages you need to use
`gh-pages` branch. This is esp. confusing if you use some of the tools that
help you build static pages.

1. create a GitHub account if needed,
1. create a `username.github.io` repository,
    * GitHub supports [using your own domain name]
1. start coding, e.g. add your own `index.html` page.


So that would be something like:
{% highlight bash %}
# create clone
git clone https://github.com/username/username.github.io
cd username.github.io

# create content
echo "Hello World" > index.html

# and publish...
git add --all
git commit -m "Initial commit"
git push
{% endhighlight %}

## Enter static page generators

> Fancy, but can you help me write a blog?

Alright, first came the `index.html` then came the [static page generators].
We're humans, free-flowing plain text is what we're good at. While I'm sure
some of you guys out there can literally piss out `html` (or lisp, or even
straight asm code haha), the rest of us wouldn't mind writing plain text files
and have some kind of compiler to make them `html`.

> What is a static page generator?

* plain text in, `html` out,
* `markdown` in, `html` out,
* `textile` in, `html` out...

> Wait, what about templates?

Ha, you got me. It's actually `text + templates = .html`.
You can find a [list on the python wiki].

> Why is a static page generator useful?

The less html tags you have to write, the more productive you get?

The other answer to that is that some of the websites are there are not apps,
people intend them to be just content (e.g. blogs, knowledge bases). What that
means is that there may be much less backend involved, or if it is involved,
it is in order to generate some content and serve a response. Does the response
need to be cached? Is the response deterministic? If it is you could just craft
the responses once, on your machine maybe, and not worry about processing the
requests and waste expensive infrastructure. Found some content out there
explaining [what is a static website] which I've found linked on
[jekyllbootstrap].

> `Jekyll` huh?

Yes, [Jekyll]. The GitHub pages have some good info on [using jekyll with pages]
so I just followed that.

So that would be something like:
{% highlight bash %}
# install jekyll
gem install jekyll

# create clone
git clone https://github.com/username/username.github.io
cd username.github.io

# create content, with some help
jekyll new .

# test locally
jekyll serve

# and publish...
git add --all
git commit -m "Initial commit"
git push
{% endhighlight %}

[Jekyll] will generate a bunch of files for you, include a footer, a header,
a `main.css`, and an `index.html`.
{% highlight bash %}
$ tree
.
├── _config.yml
├── _includes
│   ├── footer.html
│   ├── head.html
│   └── header.html
├── _layouts
│   ├── default.html
│   ├── page.html
│   └── post.html
├── _posts
│   └── 2014-09-21-welcome-to-jekyll.markdown
├── _sass
│   ├── _base.scss
│   ├── _layout.scss
│   └── _syntax-highlighting.scss
├── about.md
├── css
│   └── main.scss
├── feed.xml
└── index.html

5 directories, 15 files
{% endhighlight %}

> Do I have to <samp>ctrl-c</samp> each time I make changes?

No, you don't, just use `jekyll serve --watch` and that will look for file
changes and re-process your pages.

![jekyll default page](/img/jekyll-default-site.png)

## Conclusion

Getting started with GitHub pages isn't too hard. A lot of great tools now
make it a breeze to get up and running. Upcoming [part 2] will have more info
about the tools you can use to take it a step further.


[static page generators]: https://www.staticgen.com/
[using your own domain name]: https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages
[what is a static website]: http://nilclass.com/courses/what-is-a-static-website
[jekyllbootstrap]: http://jekyllbootstrap.com/
[Jekyll]: http://jekyllrb.com/
[using jekyll with pages]: https://help.github.com/articles/using-jekyll-with-pages
[list on the python wiki]: https://wiki.python.org/moin/StaticSiteGenerator
[part 2]: {% post_url 2014-09-21-building-a-blog-2 %}
