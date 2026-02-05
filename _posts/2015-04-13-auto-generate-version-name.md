---
layout: post
title: Auto-Generate Version Name a.k.a. It Is So Boring Incrementing Build, Let Git Do It
date:   2015-04-13 20:52:00
categories: [android, git, gradle]
tags: [android]
updates: []
---
_0.0.1_, _0.0.2_, _0.1.0_, _0.1.1_, _0.1.3_,.... I'm super lazy, and I get bored really quickly with repeating tasks. So, whenever
I can offload something to a script, I just do it.<br>
One such offloading I've done lately, is versioning the APK.<br>

So, I've created a very simple _Groovy_ plugin for _Gradle_, which will calculate
the [version-code](http://developer.android.com/tools/publishing/versioning.html) and
version-name based on the count of commits in the git repo. It's is not the brightest
method, but it is so damn simple, it has to work.. Right?

# Plugin #
Gradle can be extended using [Groovy](http://en.wikipedia.org/wiki/Groovy_%28programming_language%29) plugins (under the `buildSrc` folder). We'll use that to provide two static methods to our `build.gradle` file:
{% gist adeaa10544e911c55365 VersionBuilder.groovy %}
This file should be saved as `[project root]/buildSrc/src/main/groovy/versionbuilder/VersionBuilder.groovy`<br>

## API ##
This is will give you two public static methods which you can use:

 * `buildGitVersionNumber` - Returns an integer which can be used as your project's
 _versionCode_.
 * `buildGitVersionName` - Returns a _major.minor.build_ string which can be used as
 project's _versionName_. Change the plugin's code, if you prefer a different template for
 versioning.

## Example ##
To use those methods, in your `build.gradle` file:
{% gist adeaa10544e911c55365 build.gradle %}

## Configuring ##
You probably noticed two _constants_ in [plugin's code](https://gist.github.com/menny/adeaa10544e911c55365#file-versionbuilder-groovy):

 * `GIT_COMMIT_COUNT_NORMALIZE` - Use this to subtract a constant from the commits count. Use this to set the initial _versionCode_ as close as possible to your current _versionCode_.
 * `GIT_COMMIT_COUNT_MINOR_NORMALIZE` - you'll probably want to reset your _build_ versioning every time you bump _minor_ or _major_.<br>
 <br>
 Things will just work from now on! No need to figure versions anymore, what a [profit](https://xkcd.com/1205/), ah?<br>
