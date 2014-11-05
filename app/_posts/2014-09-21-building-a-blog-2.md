---
layout: post
title:  "Building a blog on github. part 2."
date: '2014-09-21 23:44:21'
categories: howto
---

If you missed it, here is [part 1].

## Enter scaffolding tools

> What is a scaffolding tool?

Okay, [Jekyll] is a `static page generator` and gives you the ability to
transform your `markdown` posts into `html` pages, but from a reusability point
of view, it is sort of limited. Are you going to use `jekyll` for all your
apps? Maybe, maybe not.

That's why you may want to look for a scaffolding tool. Yes, you know; those
metal or bamboo structures around buildings when they are getting built.
Doesn't matter which kind of building / app you want to build, you can use
a scaffold.

> Okay, where can I find one?

[Yeoman] is one of them. Want to build a blog with Jekyll? Yeoman's got your
back. Want to build an Angular app? Yeoman's got your back. It has
[more than a thousand generators] to help you build the app or website you
want to build. Oh, and a generator is just a bunch of recipes, they have
generators / recipes for all kinds of projects.

## Enter Yeoman.

[Yeoman] is comprised of a set of CLI tools that are based on [Node.js] -- so
yes, if you haven't installed it yet, you may need to. The package can be
installed with `npm`. The [getting started] will walk you through the steps.

Install the tools:
{% highlight bash %}
npm install --global yo
{% endhighlight %}

Install a generator (e.g. jekyll):
{% highlight bash %}
npm install --global generator-jekyllrb
{% endhighlight %}

Get started, please note our little friend will ask you some questions so
please pay attention.
{% highlight bash %}
$ yo jekyllrb

     _-----_
    |       |
    |--(o)--|   .--------------------------.
   `---------´  |    Welcome to Yeoman,    |
    ( _´U`_ )   |   ladies and gentlemen!  |
    /___A___\   '__________________________'
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

This generator will scaffold and wire a Jekyll site. Yo, Jekyllrb!

Tell us a little about yourself. ☛
[?] Name: Damien Nozay
[?] Email: damien@example.com
... more prompts ...
{% endhighlight %}

And when it's done, you can see what it has generated for you:
{% highlight bash %}
$ git status -uall
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

    .bowerrc
    .csslintrc
    .editorconfig
    .gitattributes
    .gitignore
    .jshintrc
    Gemfile
    Gemfile.lock
    Gruntfile.js
    _config.build.yml
    _config.yml
    app/_layouts/default.html
    app/_layouts/post.html
    app/_posts/2014-09-22-welcome-to-jekyll.md
    app/_posts/2014-09-22-yo-jekyllrb.md
    app/_scss/main.scss
    app/_scss/readme.md
    app/_scss/syntax.scss
    app/index.html
    app/js/main.js
    bower.json
    package.json

nothing added to commit but untracked files present (use "git add" to track)
{% endhighlight %}

If we were using jekyll directly rather than `yo`, we would be starting
the edit-compile-serve / edit-preview loop with `jekyll serve`; with the
inputs I gave to `yo`, I chose to use `grunt` which takes care of that.
{% highlight bash %}
grunt serve
{% endhighlight %}

And here is our shiny new blog:

![jekyllrb generated page](/img/jekyllrb-default-site.png)


[part 1]: {% post_url 2014-09-21-building-a-blog %}
[static page generators]: https://www.staticgen.com/
[Jekyll]: http://jekyllrb.com/
[Yeoman]: http://yeoman.io/
[more than a thousand generators]: http://yeoman.io/generators/
[Node.js]: http://nodejs.org/