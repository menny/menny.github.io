---
layout: post
title: Multiple API Level APK Release a.k.a 
date:   2013-12-10 10:29:00
categories: [android]
tags: [tips, anysoftkeyboard]
---
Up until recently, [AnySoftKeyboard](http://anysoftkeyboard.github.io) was supporting Android devices all the way back to 1.5 in a single APK.
Mostly, it worked fine, and I was able to use [FrankenRobot](http://evendanan.net/2011/04/Backward-compatibility-in-Android-OR-How-I-made-a-2-2-Android-APK-run-under-1-5/)
to utilize higher API levels features successfully. But there was a cost.

**TL; DR;**, you can check out [this screen-shot](https://lh6.googleusercontent.com/--sfgL7VjzbE/Uqc_eTbtugI/AAAAAAABVlg/VlDicW7uERY/s1800/multiple_API_versions_releasing.png), which explains a lot.

Android 1.5 can not support the [Support Library](http://developer.android.com/tools/support-library/index.html) (which includes the Fragment support), and Android 1.6 till 2.0 can not support
the App-Compact library (which includes the ActionBar), so providing a single APK for all devices had it cost: no modern UI/UX.

## Separating ##
After reading what Google has to [say](http://developer.android.com/google/play/publishing/multiple-apks.html) (read it, it is very good background) about it, 
I've decided to separate the App by API level: API 3, API 4-6, and API 7+. Why this separation:

### API 3 - Android v1.5 ###
Devices still running Android 1.5 are very [old](http://en.wikipedia.org/wiki/HTC_Dream). They are very limited on internal storage, RAM and CPU power.
I've decided to create a special [build](https://github.com/AnySoftKeyboard/AnySoftKeyboard/tree/API3) for those phones: minimal resources (just MDPI), just ARM jni, and removed all code that does not support this API level.
I was able to reduce the size of the APK from 3.2MB to 2.1MB, which is very helpful for owners of those devices.

This is the _AndroidManifest_ file for this build:
{% gist 7893053 AndroidManifest_API3.xml %}

### API 4-6 - Android v1.6-v2.0 ###
These devices are usually much [better](http://en.wikipedia.org/wiki/Motorola_Droid). But due to OS limitations, they can not support
modern UI language (like the ActionBar). So, here, I've decided to also create a separate [build](https://github.com/AnySoftKeyboard/AnySoftKeyboard/tree/API4_6) for these API levels. 
Again, reduced set of resources (MDPI and HDPI), a few more jni libs, and reduced set of functionality (e.g., no voice input).

This is the _AndroidManifest_ file for this build:
{% gist 7893053 AndroidManifest_API4.xml %}

### API 7+ - Android v2.1 ###
This API level supports all the required support library, and usually, those devices are [very](http://en.wikipedia.org/wiki/Samsung_Galaxy_S_II) [strong](http://en.wikipedia.org/wiki/Nexus_4).

This is the _AndroidManifest_ file for this build:
{% gist 7893053 AndroidManifest_API7.xml %}

### Things to Note ###
You'll notice that for an higher API level, there is an higher _versionCode_:

 * First APK is for ```android:minSdkVersion="3"```, and has ```android:versionCode="112"```.
 * Second APK is for ```android:minSdkVersion="4"```, and has ```android:versionCode="113"```.
 * Third APK is for ```android:minSdkVersion="7"```, and has ```android:versionCode="114"```.
 
This is required in case the user's device will get an OS upgrade that requires an APK for an higher API level, 
e.g., say your HTC G1 is running Android 1.5, and then, one glory morning, you are pushed with an OS upgrade to Android 1.6,
prior to the OS upgrade, you have be given ```android:versionCode="112"```, but after the OS upgrade, this version is no longer compatible with your device.
Don't worry, Play Store to the rescue! It will automatically update your APK to ```android:versionCode="113"```. And since it needs to _update_
your APK, it is required the that new APK will have a higher _versionCode_. Got it?

## Play Store Configuration ##
After you have your APKs built, each with its own ```android:minSdkVersion``` and ```android:maxSdkVersion```, you can upload them to the _Play Store_.
You should see something like this:

![Play Store multiple APKs release](https://lh6.googleusercontent.com/--sfgL7VjzbE/Uqc_eTbtugI/AAAAAAABVlg/VlDicW7uERY/s1000/multiple_API_versions_releasing.png "Note the versionCode and the API levels")

How's that for _A picture is worth 37.5 tweets!_!

Good luck.

