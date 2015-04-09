---
layout: post
title: Migrating to Robolectric v3 a.k.a Just Work, Dear God, Just Work!
date:   2015-04-08 22:07:00
categories: [android, robolectric, unit-test]
tags: [walkthrough]
---
[Robolectric](https://robolectric.org) has reach a big milestone recently: [V3-rc2](https://groups.google.com/forum/#!topic/robolectric/1XWVJvKiFjA), so it was time
to upgrade all my personal projects.
With the new release, they have introduced new concepts and new APIs (and removed and renamed others).
In most cases, I find the new API and structure much more readable, and generally like it.
But since I'm a user of _Robolectric_ since way-back, it also means that the unit-tests will have to be re-adjust to the new API.

First, to make things clear, if it wasn't worth the hussle, I would not upgrade to v3, but this new version comes with a lot of nice improvements
and _Robolectric_, in general, is [awesome](http://stackoverflow.com/a/18271651/1324235) beyond words.

Let's start with the basic stuff, like:
# Gradle stuff #
You no longer need the _Robolectric_ Gradle plugin. So just remove
`classpath 'org.robolectric:robolectric-gradle-plugin` from _build.gradle_.
Some developers had used a hack to get _Robolectric_ tests navigable in Android Studio:
```
  sourceSets {
    androidTest {
      setRoot('src/test')
    }
  }
```
<br> or <br>
```
apply plugin: 'idea'

idea {
  module {
    testOutputDir = file('build/test-classes/debug')
}
```
You don't need those anymore.

Any specific _Robolectric_ settings should also be removed, since we are not using the _Robolectric Gradle Plugin_ anymore. Remove this:
```
robolectric {
  include '**/*Test.class'
  exclude '**/espresso/**/*.class'

  maxHeapSize = "2048m"
}
```
With _Android Gradle Plugin v1.1.0_ there is a built-in support for unit-test (using _mutableAndroidJar_), so we no longer need to setup
_Robolectric_ as androidTestCompile.
Change `androidTestCompile('org.robolectric:robolectric:2.4')` to `testCompile 'org.robolectric:robolectric:3.0-rc2'`
**DO NOT USE** `com.squareup:fest-android:1.0.8`. If you have it in your `testCompile` be sure to remove it. There is a conflict between
it and _Robolectric_ which causes all Fragment/Activity related unit-tests to [fail](https://github.com/robolectric/robolectric/issues/1633) with `NoSuchMethodError`.


# Entry Points #
 * `Robolectric.application` does not exist anymore. From now own use `RuntimeEnvironment.application`.
 * `Robolectric.shadowOf()` does not exist anymore. From now own use `Shadows.shadowOf()`.

# TestRunner #
You have probably used `@RunWith(RobolectricTestRunner.class)` in your classes. Switch to `RobolectricGradleTestRunner`, but you'll also need to add a `@Config`
annotation too, which points to your app's `BuildConfig` class:
```
@RunWith(RobolectricGradleTestRunner.class)
@Config(constants = BuildConfig.class)
```
I opted to a different approace: a custom test-runner that sets the Robolectric configuration:
{% gist c45781b8d980f4a60ae3 CustomGradleTestRunner.java %}
This test-runner will set the app's SDK level to 21 (since Robolectric does not support anything higher than that, right now), and will
set the `constants` value to the app's BuildConfig class.



Please share your tips and tricks for migrating in the comments! I'll update this post as things coming in
