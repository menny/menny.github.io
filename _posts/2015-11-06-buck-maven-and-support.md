---
layout: post
title: Maven and Support Library Artifacts in Buck a.k.a. Wait, It Doesn't Have Full Dependency Resolution Support!?
date:   2015-11-06 11:32:00
categories: [android, buck, gradle, maven]
tags: [android]
---
[Buck](https://buckbuild.com/) is _Facebook_'s super fast build system. How fast? Up to [7.5 times](https://buckbuild.com/article/exopackage.html). That was intriging enough to get me to try it out, and immediately realizing that the platform is not complete..
One of the features missing is proper and complete support for _Maven_ remote artifacts (aar and jar) and locally hosted Support Library artifacts.

# Remote Maven Artifacts #
So, _Buck_ does support _Maven_ artifacts in a rule called [remote_file](https://buckbuild.com/rule/remote_file.html), which can fetch
files remotely, process them and make them available to the code-base. For example, if you want `com.google.guava:guava:18.0` dependency
you'll create a `remote_file` rule like this:
{% gist 832c6a3a5e10752fd357 file-remote_file_jar.py %} 
and depend on it in one of your targets:
{% gist 832c6a3a5e10752fd357 android_library_with_remote_file.py %} 
<br/>
 * Replace `jar` with `aar` if you want to fetch `aar` libraries.

## The `maven` rule ##
This works, but wouldn't it be easier and more friendly if you could import artifacts as easily as _Gradle_ allows?<br/>
Based on [zserge](https://github.com/zserge/buckbone/blob/master/buckbonejava) work, here's a simple way to achieve exactly that.
First, create a `DEFS` file in your project's root folder, and add `mavensha1` and `maven` functions to it:
{% gist 832c6a3a5e10752fd357 maven_rule.py %}
Second, import the `DEFS` file to you project, but add the import code to the `.buckconfig` file:
{% gist 832c6a3a5e10752fd357 .buckconfig.yaml %}
This will make `maven` rule available to every `BUCK` file. So, now you can simply depend on the rule in your target, like this:
{% gist 832c6a3a5e10752fd357 library_with_maven_rule.py %}

It doesn't matter if the artifact is an AAR or a JAR, this `maven` rule will fetch either!

# The Support Library case #
For some reason (legal? distribution?), the support library is not available in [Maven Central](http://search.maven.org/)
and instead, Google directly place it under your SDK folder (`[SDK folder root]/extras/android/m2repository/`). That does not help the `mvn:`
prefix to find it.. The only safe way to make this work is by manually copying the `AAR` file from there to a folder in your project
(Buck will not allow to reference a file outside the project's folder structure).

## The `android_support_library` rule ##
First, add another _rule_ to the `DEFS` file we defined above:
{% gist 832c6a3a5e10752fd357 android_support_library.py %}
Then copy the libraries you need in your project to a locale folder inside your project (lets say `libs`). Create a `BUCK` file
in that folder and import the support libraries:
{% gist 832c6a3a5e10752fd357 DEFS_support_libraries.py  %}
Now you have targets you can depend on when creating Android app:
{% gist 832c6a3a5e10752fd357 target_with_support_library.py %}

# Conclusion #
This is an amazing build platform! So fast, and so explicit to define and makes complete sense. The problem is that if you are to use it, you kinda giving up on _Gradle_, or any other (_Bazel?_) build system. The reason is that Facebook has its own idea of how an Android project is built, and how the relations between libraries and modules are defined. For example, you will not longer have resource merging, resource overwriting, or `R` constant values. Aligning with _Buck's_ paradigm might turn out to be a very costly operation, and will definetly will not be compatible with _Gradle_, meaning you will not be able to run both build systems on the same codebase.
