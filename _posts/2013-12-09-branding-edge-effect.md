---
layout: post
title: Branding the EdgeEffect aka Hit the Wall with Your Own Color
date:   2013-12-09 13:07:00
categories: [android, branding]
tags: [tips, hacx]
---
Lately, I've become sort of branding obsessed; colors, font sizes and types, UI language, they all seem _so_ important to me, 
I can hardly look at an App these days without pulling on my hairs and scream "God, oh God, why would they use inconsistent, non-brand colors!"
Ya, but that's my problem. Your is another: how to brand the [EdgeEffect](http://developer.android.com/reference/android/widget/EdgeEffect.html) glow, ah?

**TL;DR;** Use the gist [here](https://gist.github.com/menny/7878762#file-brandgloweffect_full-java).

Weird as it sounds, Android does not provide any method to change (or brand) the _hitting-the-wall_ feedback glow effect in its widget (ListView, GridView, ScrollView, etc.), and will only use the OS's color.
This even gets weirder, when Android 2.3 has a green edge-effect, while Android 3+ uses a blueish (Holo) color, and KitKat (v4.4) uses a gray glow effect (ironic fact: Android team changed the color of the glow effect so the Holo color will not collide with your branding, although, gray is colliding just as well, IMHO).

## The Cause ##
The _EdgeEffect_ class uses a [_Drawable_](https://android.googlesource.com/platform/frameworks/base/+/android-4.4.1_r1/core/res/res/drawable-xxhdpi/overscroll_glow.png) resource (an OS's resource, not yours, _hint, hint, Google_), which provides the glow effect, this resource is loaded internally
by the EdgeEffect class:
{% gist 7878762 EdgeEffect_ctor.java %}

And the size of the glow (how much the user _over-pulled_ the list) is calculated during ```draw(Canvas)``` call:
{% gist 7878762 EdgeEffect_draw.java %}

There is no way to change the drawable resource (_hint one, Google._), or apply a filter on the drawable (_hint two, Google._). A shame.

## Solution - Hacker style ##
What can be done? I'm going to _hack_ my way into branding this drawable. I'll take advantage of the fact that the Drawable instance is shared, and not mutate (which makes sense, right?)
and I'll load that Drawable in my code, and apply a filter on it:
{% gist 7878762 brandGlowEffect.java %}

### What just happened? ###
The name of the glow resource has never changed in Android's history (so far), (line 1) so I'll get its identification,
(line 2) load the Drawable, which is shared instance across my Application, thus the same one EdgeEffect is using,
(line 3) and apply a MULTIPLY filter on it, with the brand's color.

### What about the overscroll_edge resource ###
The edge-effect is broken to two drawables: the glow (*overscroll_glow*), and the edge (*overscroll_edge*). This method allows the EdgeEffect class to stretch just the glow, and keep the edge crisp.
To brand the edge (you'll probably want to do that too), use this revised method, which brand both the glow and the edge:
{% gist 7878762 brandGlowEffect_full.java %}


## Pitfalls ##
 * Android may decide to change the name of the resource, in which case you'll need to change the call to ```getIdentifier```
 * The shared instance may be unloaded from memory, so remember to call the ```brandGlowEffect``` after each creation of EdgeEffect (after creation of ListView, GridView, ScrollView, or your own instance of EdgeEffect), best place will be in the Activity's ```onCreate```, right after setting the layout.
 * I'll emphasis the first point (since this is the core of the hack, and it's a _reflection_ kind of solution, thus dangerous): make sure this method works on the target Android version you had in mind. I take no responsibility!
 
## Branding - The Technical Challenge ##
An App should be useful, easy to use, effective, beautiful, stable. It should also be unique, and represent its creator. This is where _Branding_ comes in -
a way to express and show yourself in the App UI: colors, Type-face and font sizes, language, behavior, icons and graphics, etc.

I'll try to post more about this subject, but not from a marketing, design, or decision (reason) standpoint. Instead I'll show you _how_, technically, to brand your App. 
E.g., in this post I've shown how to change the color of Android's build-in Edge-Effect, you can use this method to change the glow color to your brand's main (or secondary) color! What ever that color maybe (which is a design decision).