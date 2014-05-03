---
layout: post
title: CI with Shippable a.k.a Super Fast, and Proving It
date:   2014-05-01 13:07:00
categories: [android, ci]
tags: [tips]
---
Let's start with times:
 * starting an emulator: _2 minutes_
 * installing an APK and the test APK: _30 seconds_
 * Running one instrumental test: _5-20 seconds_
 * A medium project will have **60** of those: _12.5 minutes_
 * Running lint: _30 seconds_
 * Running Robolectric tests: _40 seconds_.
Adds up to about 16 minutes. Some projects are smaller, most respected codebase are larger.
 * Letting something else run those test: _timeless_!

## Continuous Integration


_Italic_
**Bold**
[this](https://gist.github.com/menny/7878762#file-brandgloweffect_full-java) is a link
# Header 1 #
## Header 2 ##
### Header 3 ###
And a gist:
{% gist 7878762 EdgeEffect_ctor.java %}

some inline ```code``` call:
