---
layout: post
title: Migrating to Robolectric v3 a.k.a Just Work, Dear God, Just Work!
date:   2015-04-09 13:52:00
categories: [robolectric, unit-test]
tags: [android]
---
[Robolectric](https://robolectric.org) has reach a big milestone recently: [V3-rc2](https://groups.google.com/forum/#!topic/robolectric/1XWVJvKiFjA), so it was time
to upgrade all my personal projects.<br>

With the new release, [the team](https://github.com/orgs/robolectric/people) has introduced new concepts and new APIs (and removed and renamed others). In most cases, I find the new API and structure much more readable, and generally like it.<br>
But as a long time user of _Robolectric_, it also means that I have a lot of code to refactor.
<br>

   **Note:** all code in this post is _Public Domain_ as described in [CC0](https://wiki.creativecommons.org/CC0).
<br>

First, to make things clear, if it wasn't worth the hassle, I would not upgrade to v3, but this new version comes with a lot of nice improvements
and _Robolectric_, in general, is [awesome](http://stackoverflow.com/a/18271651/1324235) beyond words.
<br>

Second, let's get to the migration guide:<br>
# Gradle stuff #
You no longer need the _Robolectric_ Gradle plugin. So just remove
`classpath 'org.robolectric:robolectric-gradle-plugin'` from _build.gradle_.<br>
Some developers had used a hack to get _Robolectric_ tests navigable in Android Studio:
{% gist c45781b8d980f4a60ae3 remove-androidTest %}
and/or
{% gist c45781b8d980f4a60ae3 remove_idea_plugin %}
You don't need those anymore.
<br>

Any specific _Robolectric_ settings should also be removed, since we are not using the _Robolectric Gradle Plugin_ anymore. Remove this:
{% gist c45781b8d980f4a60ae3 remove_robolectric_config %}
<br>

With _Android Gradle Plugin v1.1.0_ there is a [built-in support for unit-test](http://tools.android.com/tech-docs/unit-testing-support) (using [_mockableAndroidJar_](https://android.googlesource.com/platform/tools/base/+/e8f845b47459973838c99656ae98563b268f21ff/build-system/gradle/src/main/groovy/com/android/build/gradle/internal/tasks/MockableAndroidJarTask.groovy)), so we no longer need to setup
_Robolectric_ as _androidTestCompile_.<br>
Change `androidTestCompile('org.robolectric:robolectric:2.4')` to `testCompile 'org.robolectric:robolectric:3.0-rc2'`<br>
**DO NOT USE** `com.squareup:fest-android:1.0.8`. If you have it in your `testCompile` be sure to remove it. There is a conflict between
it and _Robolectric_ which causes all Fragment/Activity related unit-tests to [fail](https://github.com/robolectric/robolectric/issues/1633) with `NoSuchMethodError`.
<br>

# TestRunner #
You have probably used `@RunWith(RobolectricTestRunner.class)` in your classes. Switch to `RobolectricGradleTestRunner`, but also add a `@Config` annotation, and point to your app's `BuildConfig` class:
{% gist c45781b8d980f4a60ae3 MainActivityTest.java %}
This is enough, but I opted to a different approach: a custom test-runner that sets the _Robolectric_ configuration:
{% gist c45781b8d980f4a60ae3 CustomGradleTestRunner.java %}
This test-runner will set the app's SDK level to 21 (since _Robolectric_ does not support anything higher than that, right now), and will
set the `constants` value to the app's BuildConfig class.
<br>

# API and Behavioral Changes #
## Entry Points ##
 * `Robolectric.application` does not exist anymore. From now on use `RuntimeEnvironment.application`.
 * `Robolectric.shadowOf()` does not exist anymore. From now on use `Shadows.shadowOf()`.
 * `Robolectric.getShadowApplication()` does not exist anymore. From now on use `ShadowApplication.getInstance()`.
 <br>

## Activity life-cycle management ##
_Robolectric_ lets you manage the life cycle of the activity using it's `ActivityController`. This is still there, but there are two
additions:

+ `ActivityController.postCreate()` was added.
+ `ActivityController` now has a new `setup` method which is a shorthand for `create().start().postCreate(null).resume().visible().get()`.
+ and another shorthand was added `Robolectric.setupActivity(Class<T extends Activity>)`.

Quite useful.
<br>

## Add-On Modules ##
_Robolectric_ is now broken up a bit; the main library will only include Shadows for the main Android framework classes, and anything else (support library, maps, etc) is served as an [Add-On Module](http://robolectric.org/using-add-on-modules/).<br>
I don't have much to say about that, other than: if you want a Shadow of a class that is part of an external library (for example, _support-v4_'s `LocalBroadcastManager`), be sure to include the right _Add-On_ (for example `testCompile 'org.robolectric:shadows-support-v4'`). You can access the Shadow using the _Add-On_'s specific `Shadows` entry-point (for completeness: `org.robolectric.support.v4.Shadows`).

## Missing stuff ##
This is what I've found so far:

 * `IntentFilter` will not do `equals` correctly anymore. I guess that this is due to some cleanup, which resulted in _Shadows_ to be removed. I used a new static method to calculate `match`:
{% gist c45781b8d980f4a60ae3 IntentFilterIsSimilar.java %}
   I use [Mockito](http://mockito.org/) a lot and needed a  [Matcher](https://gist.github.com/menny/c45781b8d980f4a60ae3#file-intentfilterequalmatcher-java) too.
<br>

## Replaced stuff ##
This is what I've found so far:

 * `TestCursor` was replaced with `RoboCursor`, which is an improved version of it. This is a great addition.
 * _UI Thread_ is now called _ForegroundScheduler_, which means that `Robolectric.runUiThreadTasksIncludingDelayedTasks()` is now called `Robolectric.flushForegroundScheduler();`

## Other ##
This is what I've found so far:

 * [`Time`](http://developer.android.com/reference/android/text/format/Time.html) now **respects** the default time-zone! So make sure you set it correctly in your unit-tests (most probably in the `@Before` method):
 {% gist c45781b8d980f4a60ae3 TimeTest.java %}
 Also, note that `Time` is _Deprecated_ with API-22, so you might want to refactor to use [`GregorianCalendar`](http://developer.android.com/reference/java/util/GregorianCalendar.html). But, no pressure.
 * _Robolectric_ now supports API level 21! This means that if you _assumed_ in your tests that you are running on an API level 18 (which was the highest/default API level for _Robolectric_ v2.4), this is **no** longer the case! The default API level is 21!<br>
 `@Config(emulateSdk = 18)` or `@Config(qualifiers = "v19")` are your best friends there. And don't forget to add the missing unit-test for API levels higher than that.
<br>

<br>
Please share your tips and tricks for migrating in the comments! I'll update this post as things coming in
