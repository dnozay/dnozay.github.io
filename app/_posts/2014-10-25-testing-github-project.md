---
layout: post
title: Testing your GitHub project.
date: '2014-10-25 15:45:10'
categories: testing
tags: testing,tox,travis,github,ecosystem
---

[Continuous integration][1] is something I value a lot in software projects.
If you are already hosting your code on [GitHub][2], for public or private
repositories, then you can leverage a lot of tools available in the ecosystem.

# Travis-CI

Let me just quote [their README](https://github.com/travis-ci/travis-ci):

> [Travis CI](https://travis-ci.com) is a hosted continuous integration and
deployment system. There are two versions of it,
[travis-ci.com](https://travis-ci.com) for private repositories, and
[travis-ci.org](https://travis-ci.org) for public repositories.

Once you enable Travis for your project, it will test all the branches for
which it is enabled as well as the pull requests.
Pure glittering awesome. Plus, if you [look at their pricing][4],
it is **free** for open source projects; ... *awesomeness squared*. Head over
to the docs, and [get started][5].

## Why?

Having some kind of metric to check that a commit is good or bad is useful.
There is no point in doing an automatic merge of a commit that will cause tests
to fail. Instead, it is smarter to apply changes locally, fix them and only
then merge them.

E.g. GitHub shows Travis commit status:

![testing pull requests with Travis](/img/2014-10-25-pullreq-travis.png)

That is a pretty neat integration with GitHub; when Travis tests your
GitHub changes, it will then notify [GitHub of your commit status][7]
(more info: [commit status API][8]).

## Adding a badge to your `README.md`

Once your project is enabled, then you can also add the badge in your project's
`README.md` so it will show on the project page (or GitHub project pages). This
will let your users (end-users or library consumers) know how everything is
looking; and collaborators that they may want to spend some time fixing the
branch.

E.g. [xmlrunner][6] build status: [![xmlrunner build status](https://travis-ci.org/xmlrunner/unittest-xml-reporting.svg?branch=master)](https://travis-ci.org/xmlrunner/unittest-xml-reporting)

## Enabling Travis for your project

1. review [the documentation][5].
1. go to the [profile][10] page.
1. profit.

![enabling Travis for xmlrunner](/img/2014-10-25-enable-travis.png)

## Adding a `.travis.yml` configuration

1. review [the documentation][9].
1. add a `.travis.yml` file.
1. profit.

Here is a minimalist configuration for testing a python project using
[`tox`][11], which I will cover in the next section.

<script src="https://gist.github.com/dnozay/27ff0d8d589b6593b4be.js"></script>

# Tox

Let me quote [the `tox` doc][11]:

> `tox` aims to automate and standardize testing in Python. It is part of a
larger vision of easing the packaging, testing and release process of Python
software.

## Two-liner example

Let's start with a very simple example that involves letting `setuptools` run
the testsuite ([setuptools doc][12]):

<script src="https://gist.github.com/dnozay/a4dd19777723ae1f6969/f0edecd8bf27c0aa288544558f1c23bcadeaea98.js"></script>

## Testing multiple python versions

Let's rewind for a bit... [**What is tox?**][13].

> Tox as is a generic virtualenv management and test command line tool you can use for:
>
> * checking your package installs correctly with different Python versions and
  interpreters
> * running your tests in each of the environments, configuring your test tool of choice
> * acting as a frontend to Continuous Integration servers, greatly
  reducing boilerplate and merging CI and shell-based testing.

So would that mean I can test python `2.6`, `2.7`, and `3.3`? Yes.

<script src="https://gist.github.com/dnozay/a4dd19777723ae1f6969/d871e87686b0355fc8f8454aad8b5947df413c00.js"></script>



[1]: http://en.wikipedia.org/wiki/Continuous_integration
[2]: https://github.com/
[3]: https://travis-ci.org/
[4]: https://travis-ci.com/plans
[5]: http://docs.travis-ci.com/user/getting-started/
[6]: https://github.com/xmlrunner/unittest-xml-reporting
[7]: https://github.com/blog/1227-commit-status-api
[8]: https://developer.github.com/v3/repos/statuses/
[9]: http://docs.travis-ci.com/user/languages/python/
[10]: https://travis-ci.org/profile
[11]: https://testrun.org/tox/latest/
[12]: https://pythonhosted.org/setuptools/setuptools.html#test-build-package-and-run-a-unittest-suite
[13]: https://testrun.org/tox/latest/#what-is-tox
