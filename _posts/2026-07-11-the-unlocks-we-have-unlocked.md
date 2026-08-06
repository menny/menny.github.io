---
layout: post
title: "Like this. No, Wait... Maybe Like That? a.k.a. The Unlocks We Unlocked"
date: 2026-07-11 12:00:00
first_letter_image: "assets/first-letter/2026-08-04-unlocks"
categories: [ai, art]
tags: [tattoo, productivity]
updates:
  - date: 2026-08-04 10:00:00
    reason: "Initial AI-assisted technical research paragraph"
---

I have this idea for a tattoo I've been thinking about for quite some time—maybe 3 years. I know what the essence of it is:
- It's a visual representation of an audio frame
- From the song [Telegraph Road](https://open.spotify.com/track/3k3rbIRXYS7g6RN3jeyjwc?si=dc254891c5d04126)
- A specific guitar sequence
- Likely black ink
- It will be smallish, I'd say 1–2 cm
- It will peek behind one of my ears

Yeah. If you're reading this description, I bet you're imagining something. You might think "this is cool" or maybe "meh". Regardless, I'd bet good money that it's _not_ what I imagine.

So, over the years I've tried to capture that frame using an [o-scope](https://en.wikipedia.org/wiki/Oscilloscope), a [spectrogram](https://en.wikipedia.org/wiki/Spectrogram), or [guitar tabs](https://en.wikipedia.org/wiki/Tablature). I described this to different people, and even tried to draw it.
The outcome never looked the way I wanted or imagined. But why? I know what I want, I even have a vague mental image of it, and yet I cannot produce it.

## Why is that?
Well, obviously, I am not an artist, so I can't draw this. I'm not an audio engineer, so I am unequipped to generate the right spectrogram—I even doubt that a spectrogram is the right visual for it. I'm not a guitar player, so my ability to find the right tab is limited.
And on and on and on. Real blockers. My imagination is _locked_ behind my lack of capability.

You know what capability I do _possess_? I am a software engineer.

## Disclaimer

This post is not about a novel approach for how to use AI; it's not even an out-of-the-ordinary use case. Here I am merely pointing to what AI really solves for us—engineers—in our day-to-day work.

## Let's unlock this

If I can't produce a quality drawing, maybe I can PoC this—produce various versions of my idea and see what feels right to me. Once I have a couple of versions I like, I can show them to an actual artist and get their feedback. But at that point, the only person I need to excite is me—hey, I will have it permanently on my skin.

### Plan
Here is my plan to generate some options:
0. Get a digital file (MP3) of the song. Luckily, I own the [CD](https://en.wikipedia.org/wiki/Compact_disc) (yes, I linked to Wikipedia's `CD` because I have no idea how young you are), so ripping that is easy.
1. Use AI to understand the technical parts:
  1. how to read an audio file into a buffer
  2. how to extract audio metadata
  3. do I need [FFT](https://en.wikipedia.org/wiki/Fast_Fourier_transform), or maybe raw [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation)
  4. what TypeScript (I arbitrarily pick TypeScript for my work here) library can help me with that
  5. what are my options for audio visual presentations
2. Use AI to design (plan) the technical execution of the POC tool:
   1. UX for pinpointing the data frame
   2. UX for switching between different visualizations
   3. How to adjust each visualization
   4. UX for freezing/exporting a frame
3. Use AI to implement the tool

Before the days of AI, searching and summarizing the different tools would take hours. This will now take ~20 minutes.
Going over the technical aspects (pros/cons, different APIs, capabilities, etc.) would have taken about a day. This will now take ~30 minutes.
Planning? ~A day before AI. It will take me a few minutes now.
Implementation (coding, iterating, revising, etc.) would have taken me days (mind you, this is a completely new field for me, a new technology, and I am not that good with TypeScript). I bet AI will spit this out in 15 minutes.

## The Unlock
Prior to AI, such an endeavor—yes, I use exactly that word—would have been intimidating: do I have the time? Can I really do this? Is my TypeScript proficiency enough? Do I have the focus to go over all the options and research them? Etc.
Frankly, I would postpone this even if I had a high-level plan in place.

**AI unlocked this.**

Not only does AI speed things up, or serve as the best [search tool](https://darren-broemmer.medium.com/the-search-for-intelligence-why-all-ai-is-really-just-search-e2a826ddef02) we've ever invented; the tools around AI are structured in a way to _keep_ context! I can give the Agent something to work on and come back later when I have time to focus. The details will be there: our conversation history, the details it found, the questions I asked, the breakdowns it produced, and the decisions I made. All there.

### Anecdotal benefit
A quick side note: normally, manually building something in an unfamiliar domain ends in frustration, or me [falling in love with my code](https://www.reddit.com/r/Entrepreneur/comments/1r7epfl/comment/o60ykah/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) just because I spent hours writing it. AI entirely removes that friction. Because generating and discarding ideas costs almost nothing, I can follow Rule #9 of the [Ten Rules of Performance](https://www.panopticoncentral.net/2004/02/10/the-ten-rules-of-performance/)—*to write it and rewrite it*. I can quickly cycle through iterations until I find the perfect visual to hand off to a professional, and simply throw the code away when I'm done.

## Did I do it?

So, I told you a story, but have I followed through? Was I unlocked?

### Technical research
Okay, let's prompt Gemini to help us with that:
```markdown
Explain how to extract audio frames (or raw audio buffers) from an MP3 file using standard modern web capabilities and tools.
Also, give me a very short technical review of what is the data in the audio buffer.

Complement this by finding a TypeScript library that can do the following audio functions:
- extract frequency values or amplitudes from an audio frame
- support various frame frequency representations
- review the various audio visual representations available and what each shows

Give me a basic flow of using this TS library, and very short code examples (with a lot of comments).

My goal is to experiment with different ways of 2D visualization using web canvas.

I am a seasoned coder, I have a good grasp of TypeScript, but I am not an audio engineer and I know very little about audio formats.
```

Good. First, Gemini told me it's a "fantastic project". That's nice *blushing*.

Then, Gemini gave me some really good pointers:

- We should use [Web Audio API](https://www.w3.org/TR/webaudio-1.1/) which can decode MP3, with a simple pipeline:
```
Fetch the MP3 binary -> Convert to an ArrayBuffer -> Decode into PCM samples inside an AudioBuffer.
```

It also gave me a code snippet:
```TypeScript
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

async function getRawAudioBuffer(mp3Url: string): Promise<AudioBuffer> {
  const response = await fetch(mp3Url);
  const fileArrayBuffer = await response.arrayBuffer();
  
  const decodedBuffer = await audioCtx.decodeAudioData(fileArrayBuffer);
  return decodedBuffer;
}
```

Pretty nice. It's a pure plumbing snippet, just to get me off the ground quickly.

Gemini was also nice enough to give me a crash course on what `AudioBuffer` and PCM (Pulse Code Modulation) audio are. Look at that, now I feel less awkward with technical audio jargon. It continues to talk about `rms` (Root Mean Square), `amplitudeSpectrum`, `powerSpectrum`, `chroma`, etc.—giving me novice technical descriptions for audio concepts. These will give me names for the ideas I have in my head.

It then introduces [meyda](https://www.npmjs.com/package/meyda) as the gold-standard for audio feature extraction in JS, and gives me a code example of how to use it.

This phase was so quick: one prompt, a couple of follow-ups, and my ability to express my requirements in a technical sense has grown. I was unlocked in minutes, whereas a previous (non-AI) iteration would have taken me an evening at the least.

## To be continued
That was fun. I can pause now, knowing that all the context — summary, links, follow-ups — is still there in the chat session.
Next will be brainstorming/PoC an audio visualizer and UX for tweaking the visual.

TTYL.
