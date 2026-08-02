---
layout: post
title: "Like this. No, Wait.. Maybe Like that? a.k.a. The Unlocks We Unlocked"
date: 2026-07-11 12:00:00
categories: [ai, art]
tags: [tattoo, productivity]
---

I have this idea for a tattoo, I've been thinking of it for quite some time, maybe 3 years. I know what is the essence of it:
- It's an audio representation of an audio frame
- From the song [Telegraph Road](https://open.spotify.com/track/3k3rbIRXYS7g6RN3jeyjwc?si=dc254891c5d04126)
- A specific guitar sequence
- Likely black ink
- It will be smallish, I'd say 1-2 cm
- It will peek behind one of my ears

Yeah. If you're reading this description I bet you will imagine something. You might think "this is cool" or maybe "meh". Regardless, I will put good money that it is _not_ what I imagine.

So, over the years I tried to capture that frame using [o-scope](https://en.wikipedia.org/wiki/Oscilloscope) or [spectrogram](https://en.wikipedia.org/wiki/Spectrogram) or [guitar tabs](https://en.wikipedia.org/wiki/Tablature), I described this to different people, and even tried to draw it.
The outcome never looked how I wanted or imagined. But, why? I know what I want, I even have a vague mental image of it, and yet I cannot produce it.

## Why is that?
Well, obviously I am not an artist and so I can't draw this. I'm not an audio engineer and so I am unequipped to generate the right spectrogram - I even doubt that a spectrogram is the right visual for that. I'm not a guitar player and so my ability to find the right tab is limited.
And on and on and on. Real blockers. My imagination is _locked_ behind my lack of capabilities.

You know what capability I do _possess_? I am a software engineer.

## Let's unlock this

If I can't produce a quality drawing, maybe I can PoC this - produce many various versions of my idea and see what feels right to me. Once I have a couple of versions I like, I can show them to an actual artist and get their feedback. But, at that point, the only person I need to excite is me (hey, I will have it on permanently on my skin).

### Plan
Here is my plan to generate some options:
0. Get a digital (mp3) of the song. Luckily, I own the [CD](https://en.wikipedia.org/wiki/Compact_disc) (yes, I linked to Wikipedia's `CD` because I have no idea how young you are), so ripping that is easy.
1. Use AI to understand the technical parts:
  1. how to read an audio file into a buffer
  2. how to extract audio metadata
  3. do I need [FFT](https://en.wikipedia.org/wiki/Fast_Fourier_transform), or maybe raw [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation)
  4. what TypeScript (I arbitrarily pick TypeScript for my work here) library can help me with that
  5. what are my options for audio visual presentations
2. Use AI to design (plan) the technical execution of the POC tool:
   1. UX for pin pointing the data frame
   2. UX for switching between different visualizations
   3. How to adjust each visualization
   4. UX for freezing/exporting a frame
3. Use AI to implement the tool

Before the days of AI, searching and summarizing the different tools would take hours. This will take now ~20 minutes.
Going over the technical aspects (pros/cons, different APIs, capabilities, etc) would have taken about a day. This will not take ~30 minutes.
Planning? ~day before AI. It will take me a few minutes now.
Implementation (coding, iterating, revising, etc) would have taken me days (mind you, this is a completely new field for me, new technology, and I am not that good with TypeScript). I bet AI will spit this out in 15 minutes.

# The Unlock
Prior to AI, such an endeavor (yes, I use exactly that word) would be intimidating: do I have the time? Can I really do this? Is my TypeScript proficiency enough? Do I have the focus to go over all the options and research them? Etc.
Frankly, I would postpone this even if I have a high-level plan in place.

**AI unlocked this.**

Not only does AI speed things up or is the best [search tool](https://darren-broemmer.medium.com/the-search-for-intelligence-why-all-ai-is-really-just-search-e2a826ddef02) we ever invented; the tools around AI are structured in a way to _keep_ context! I can give the Agent something to work on and come back later when I have time to focus. The details will be there: our conversation history, the details it found, the questions I asked, the break-downs it produced, and the decisions I took. All there.

## Anecdotal benefit
This is a side-note, and this could be just me: with this pattern I remove the hard, difficult, long, effort of researching, planning, and implementing. I am left with reading and deciding. This allows me to follow advice like Rule #9 of the [Ten Rules of Performance](https://www.panopticoncentral.net/2004/02/10/the-ten-rules-of-performance/) (to write it and rewrite it) more easily since I no longer [fall in love with my code](https://www.reddit.com/r/Entrepreneur/comments/1r7epfl/comment/o60ykah/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button). I feel freed to delete, revise, replace, and iterate until I find something that actually feels right because it achieves its stated goal rather than a _beautiful_ written code I engineered and coded.

# Did I do it?

So, I told you a story, but have I followed through? Was I unlocked?

## Technical research
okay, let's prompt Gemini to help us with that:
```
Explain how to extract audio frames (or raw audio buffer) from an MP3 files using standard modern web capabilities and tools.
Also, give me very short technical review of what is the data in the audio buffer.

Compliment this by finding a typescript library that can do the following audio functions:
- extract frequencies values or amplitudes from an audio frame
- support various frame frequencies representations
- review the various audio visual representations available and what each show

Give me basic flow of using this TS library, and very short code examples (with a lot of comments).

my goal is to experiment with different ways of 2d visualization using web canvas.

I am a seasoned coder, I have good grasp of TypeScript, but I am not an audio engineer and I know very little about audio formats
```

Good. First, Gemini told me it's a "fantastic project". That's nice *blushing*.
Then, Gemini gave me really good results:
We should use [Web Audio API](https://www.w3.org/TR/webaudio-1.1/) which can decode MP3, with a simple pipeline:
```
Fetch the MP3 binary -> Convert to an ArrayBuffer -> Decode into PCM samples inside an AudioBuffer.
```
## To be continued
Let's see if I continue this.

See you soon.