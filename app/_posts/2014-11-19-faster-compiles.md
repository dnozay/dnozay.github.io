---
layout: post
title:  "Chair mounted jousting and inotify..."
date: '2014-11-19 23:48:10'
categories: compiling
tags: compiling,make,inotify,fsevents,fswatch
---

![chair mounted jousting (xkcd)](http://imgs.xkcd.com/comics/compiling.png)

credit: xkcd <http://xkcd.com/303/>

# Compiling takes a long time

* Maybe you are using `make`.
* Maybe make is polling the filesystem.
* Maybe you have too many files and too many subdirectories.

I was recently reviewing some articles about [build wars][1] and trying to
figure out what makes a good and efficient build system. The claim was that
using [`gulp`][7] you have `streams` and you pipe them all together and the
build becomes very efficient. That's one aspect. Both `grunt` and `gulp` support
a `watch` method. Instant feedback is great to have to become more productivity
and most sought after. In order to get instant feedback you need to be
able to detect changes to your files and be able to perform the minimum
amount of work that is required. Why clean objects that are still perfectly
valid? Why run `make clean` at all?

Nice and fancy, but are the tools that I use daily harnessing that power?


## Django has `runserver`

At work, I use `django` in some of the projects. Here is my favorite command:

    ./manage.py runserver

I have become fond of the `autoreload` feature. If you look at the
[`django.utils.autoreload`][2] code, you will see that it tries to use
[`inotify`][3] if it is available.

<script src="https://gist.github.com/dnozay/91b56b78a1af2d4015f4.js?file=autoreload.py"></script>


## `inotify`

from [Wikipedia][3]:

> Inotify (inode notify) is a Linux kernel subsystem that acts to extend
> filesystems to notice changes to the filesystem, and report those changes
> to applications. It replaces an earlier facility, dnotify, which had similar
> goals.

In other words, rather than polling the filesystem to check what new changes
came in, the kernel subsystem notifies you. If you have a daemon running for
your compile job, it translates in some time spent walking a tree up-front;
but a net effect that it does not need to keep doing that each time; later
updates are handled more efficiently.


## `gulp.watch`

With [`gulp`][7] (a build streaming process - written in javascript) allows
you to use `gulp.watch` which monitors file changes and runs the callback
functions you provide.

<script src="https://gist.github.com/dnozay/91b56b78a1af2d4015f4.js?file=gulpsample.js"></script>

However, `gulp.watch` is provided by [`vinyl-fs`][8] which itself re-exports
`watch` from [`glob-watcher`][9], which in turns uses [`gaze`][10].


## `grunt-contrib-watch`

With [`grunt`][11] you can leverage the [`grunt-contrib-watch`][12] plugin
which allows you to monitor the file changes.

<script src="https://gist.github.com/dnozay/91b56b78a1af2d4015f4.js?file=gruntsample.js"></script>

Just as `gulp.watch` this also leverages [`gaze`][10].


## `gaze`

<https://github.com/shama/gaze>:

> A globbing fs.watch wrapper built from the best parts of other fine watch
> libs. Compatible with Node.js 0.10/0.8, Windows, OSX and Linux.

![gaze](http://dontkry.com/images/repos/gaze.png)


Here is a sample from the documentation:

<script src="https://gist.github.com/dnozay/91b56b78a1af2d4015f4.js?file=gazesample.js"></script>


# Back to `make`

I wanted to search if `make` was able to run as a daemon and use `inotify`.
This is what I found after a bit of googling and searching [stackoverflow][13].

## supplementing `make`

Possibilities are to use tools / libraries and teach `make` about them.
These are the contenders...


### `inotify-tools`

quote from the [`inotify-tools` github page][14]:

> [inotify-tools] is a package of some commandline utilities relating to inotify.
>
> The general purpose of this package is to allow inotify's features to be used
> from within shell scripts.

### `fswatch`

quote from the [`fswatch` github page][15]:

> A cross-platform file change monitor with multiple backends:
> Apple OS X File System Events API, *BSD kqueue, Linux inotify and a
> stat-based backend.

## `make` alternatives using `inotify`

If `make` does not support `inotify` there are some known alternatives that do.
It may be tedious to port the Makefiles though; which is why I would look
into making `make` better rather than rip-and-replace with a different
solution.


### `tup`

**What is tup?**

> Tup is a file-based build system for Linux, OSX, and Windows. It inputs a
> list of file changes and a directed acyclic graph (DAG), then processes the
> DAG to execute the appropriate commands required to update dependent files.
> Updates are performed with very little overhead since tup implements powerful
> build algorithms to avoid doing unnecessary work. This means you can stay
> focused on your project rather than on your build system.

After previous discoveries, I tried to look up build systems that leverage
`inotify`; I found [`tup`][4]. The website publishes a comparison between
[`make` and `tup`][5].


[1]: http://markdalgleish.github.io/presentation-build-wars-gulp-vs-grunt/
[2]: https://github.com/django/django/blob/master/django/utils/autoreload.py
[3]: http://en.wikipedia.org/wiki/Inotify
[4]: http://gittup.org/tup/
[5]: http://gittup.org/tup/make_vs_tup.html
[6]: http://en.wikipedia.org/wiki/Inotify
[7]: https://github.com/gulpjs/gulp
[8]: https://github.com/wearefractal/vinyl-fs
[9]: https://github.com/wearefractal/glob-watcher
[10]: https://github.com/shama/gaze
[11]: https://github.com/gruntjs/grunt
[12]: https://github.com/gruntjs/grunt-contrib-watch
[13]: http://stackoverflow.com/questions/5110114/
[14]: https://github.com/rvoicilas/inotify-tools
[15]: https://github.com/emcrisostomo/fswatch
