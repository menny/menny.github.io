---
layout: post
title: "Faster Builds Without Owning Code a.k.a. I Don't Know Rust, But AI Does"
date: 2026-01-18 12:00:00
categories: [ai, build-system, rust]
tags: [bazel, ai-agent, developer-experience, performance]
---

We software engineers are creatures of habit. We have our comfortable pair of slippers: the languages we know by heart. For me, and for many of my colleagues, those languages are TypeScript, Python, Java, etc.

We use these languages for everything. Not just for the app code, but for the glue that holds our build system together. In our Bazel setup, we have dozens of little helper tools: generators, linters, formatters, and transpilers.

But comfort comes with a tax. 

# The "Node.js Tax"

Let's look at a specific example: generating `.d.ts` Declaration files for our TypeScript packages. 

We have a custom tool for this. It's written in TypeScript, runs on Node.js, and uses `swc` under the hood. It's a great tool. It's readable, easy to modify, and by human standards, it's fast. It takes about **120ms** to process a large package.

120ms. That sounds fine, right?

But we have tens of thousands of packages. And in a build system like Bazel, those milliseconds add up. Every time we spin up a Node.js process, we pay a startup penalty. We pay for the single-threaded nature of the event loop - even if we use IO async operations.

To make this *truly* fast—we're talking single-digit milliseconds in most cases and ~50ms on the big ones—we would need to move to a native language. Something like Rust. We could use the specific crates (like [`oxc`](https://github.com/oxc-project/oxc), the Oxidation Compiler) directly as libraries, bypassing the process-spawning overhead and utilizing true multi-threading.

But here is the friction: **I don't know Rust.** And none of my teammates know Rust. 

At least, not well enough to write a production-grade, highly optimized build tool from scratch. And honestly? I don't want to learn it just for this one 50-line script. So, we stuck with the slow, comfortable Node.js tool.

Well... until now.

# From "Coder" to "Agent Manager"

We need to fundamentally shift how we view our role in the codebase.

For decades, we have been the *authors* of every line of code. If we didn't write it, we didn't own it. If we didn't understand the syntax, we couldn't maintain it.

This implementation constraint is now gone. We should evolve into **AI-Agent Managers**.

We don't need to know exactly how every non-critical, non-proprietary piece of code is implemented.
*   **AI is excellent at parsing code.** It can explain what a snippet does better than most original authors.
*   **AI is excellent at pattern matching.** It can look at an existing tool and say, "I will write a Rust version that behaves exactly like this."

The "secret sauce" of our company isn't in how we invoke a TypeScript compiler. That's generic code. It doesn't need to be "ours." It just needs to work.

## Letting AI Write the Rust

So, I tried an experiment. I took our `dts-emit` tool and I gave it to an AI Coding Agent.

I didn't write a single line of Rust. I didn't worry about the borrow checker. I simply described the *behavior* I wanted and the constraints (must use `oxc`, must be a CLI, must match the arguments of the old tool).

The result? [**rust_oxc_dts_emit**](https://github.com/menny/rust_oxc_dts_emit).

*   **Development Time to POC**: ~30 minutes*.
    *   *Caveat: I already had a full, battle-tested TypeScript implementation to reference, some Rust examples in the codebase, and lots of real-world test cases.*
*   **My Rust Knowledge Required**: Zero.
*   **Performance**: The new tool runs in **around 50ms**.
*   **Additional time to productize and document**: a couple of hours.

That is a **~2.4x speedup**.

```bash
# Before (Node.js + swc) - 200 typescript files
time node dts-emit src/
# 120ms

# After (Rust-based + oxc) - same 200 typescript files
time rust_oxc_dts_emit src/
# 50ms
```

By moving from a "spawning a Node process" model to a "native binary using a library" model, we obliterated the overhead. And because the AI handled the implementation, the "cost" of using a language I don't know was effectively zero.

## Identifying Candidates: It's Not Just About Rust

While Rust was the right choice for this specific task due to the `oxc` library, the principle applies to any language that offers better performance or safety for the job at hand. You might choose Go for a network service, or a pre-compiled Python binary for a complex data task.

How do you spot a candidate for an AI-rewrite?

1.  **The "Glue" Script**: Look for scripts that primarily move data between other tools. If it's just `subprocess.call` wrappers, it can be rewritten in a faster, safer language.
2.  **The "Slow but Simple"**: Tools that take noticeable time (100ms+) but do something logically simple (like generating files, parsing JSON, or checking file existence).
3.  **The "Black Box"**: Legacy scripts that everyone is afraid to touch. Since you don't understand it anyway, having an AI rewrite it in a modern, strictly-typed language often *increases* maintainability because the AI will add types and structure that the original lacked.
4.  **No Secret Sauce**: Code that relies purely on public logic or open-source libraries. If it contains complex, proprietary business logic, you might want to keep it in a language you can debug manually.

## Maintenance: The "Context Window"

The immediate question I get is: *"But what happens when it breaks? You don't know Rust!"*

This is where the Agent Manager mindset kicks in.

When it breaks, I don't open the code and try to debug memory leaks. I copy the error message, paste it to my Agent, and say: *"Fix this."*

But for this to work reliably, we need to change how we document.

In this new world, the `README.md` is not just for humans. It is the **Context Window** for the next Agent. We **MUST** have the AI document the tool meticulously:
*   Usage instructions.
*   Design decisions (why `oxc`? why this crate?).
*   Known edge cases.

This documentation ensures that when the next Agent picks up the task 6 months from now, it has the full context needed to maintain the code, even if the human "manager" has forgotten everything about it.

## Why This Matters: The Scale of Trust

The implications go beyond just saving a few milliseconds on a build script.

Right now, we are comfortable delegating these small, isolated scripts. They are easy to verify: input `in.json`, output `out.rs`. We can treat them as black boxes because the scope of failure is limited to a single build step.

But this is just the training ground.

As our confidence in AI Agents grows and their capabilities improve, the definition of "manageable code" will expand. Today it's a 50-line build tool. Tomorrow it might be a non-critical microservice, or a complex validation library. 

We are training ourselves to be Managers on the small stuff so we are ready for the big stuff. We are learning how to specify behavior rather than implementation, how to verify outcomes rather than syntax, and how to maintain systems we didn't build.

# Conclusion

We have unlocked a new category of software in our build pipeline: **High-Performance, Low-Maintenance, AI-Owned Utilities.**

We no longer have to choose between "fast" and "readable." We can have both. We just have to be willing to let go of the idea that we need to write the code ourselves.

So, look at your `package.json` scripts. Look at those slow Python glue scripts. What are you keeping around just because it's comfortable? 

It's time to evolve. Fire your inner _Node.js expert_ and hire an AI Agent manager. Start with the small tools, build your confidence, and watch your build times drop. The future of development isn't just about writing code—it's about knowing which code you shouldn't be writing at all. 
