---
layout: post
title: "My LLM Tooling Doctrine: The Unix Philosophy for Local AI"
date:   2025-11-08 12:00:00
categories: [ai, llm]
tags: [ai, developer-experience]
---

I've been building a lot of small LLM-powered CLI tools for about a year now. These are tiny utilities, each with a very specific job: one reviews my git diff, one generates a commit message, and another answers quick shell command questions.

My terminal is full of these "micro-tools."

This is a deliberate choice. It's a move away from the clunky, do-it-all monoliths and a full embrace of a philosophy that's been battle-tested for decades: the Unix philosophy.

## But Why Not Just Use an LLM Agent/Bot?
I know what you're thinking. "Why build a CLI tool at all? I'll just ask Gemini, ChatGPT, or my Claude Code Agent."

And you're right. For exploratory, conversational, or complex one-off tasks, those tools are fantastic. I use them every day.

But I'm talking about repeatable, automated, in-terminal workflows. The kind of stuff I do 50 times a day.

When I'm deep in my terminal, I want to stay in my terminal. Switching to a browser tab or an IDE-specific chat panel is a context switch. It's friction.

Let's look at the "code review" task:

### The AI Chat Bot Flow:

1. Realize I want a review.
1. Run git diff.
1. Copy the output.
1. Alt-Tab to my browser.
1. Find the right Gemini/ChatGPT tab.
1. Paste the code.
1. Type the prompt: "Please review this git diff, focusing on..."
1. Wait for the response.
1. Read it, then Alt-Tab back to my code.

That's 9 steps, and it pulled me completely out of my flow.

### The Specialized CLI Tool Flow:

Run `git ai-review`.

This is the entire philosophy. The specialized tool isn't trying to be a general-purpose brain. It's an ergonomic, zero-friction extension of your existing CLI workflow.

## Why Monolithic AI CLI Tools Feel Wrong
Once we've established why a CLI tool is the right fit for these tasks, there's a fundamental design choice to make: should it be a single, monolithic tool, or a collection of small, specialized ones?

The "one big tool" approach has serious flaws. The tool is either a jack-of-all-trades with a million confusing flags (ai-tool --task=review --target=file.js), or it has a "smart" prompt-router that tries (and often fails) to guess what you want.

Worst of all, it puts the burden of context on you, the user. You have to manually copy-paste your code, your diff, or your error message. It's dumb.

## The Beauty of Specialized LLM Tools
This is where the Unix philosophy comes in: make each program do one thing well.

When you build small, separate tools, magical things happen.

1. Implicit, "Smart" Context: This is the killer feature. A specialized tool knows its job, so it can fetch its own context.
  * `git ai-review` (my code-review tool) doesn't need me to pipe a diff. It just runs git diff itself.
  * `gcai` (commit-message) runs git diff --staged automatically.
  * `git pr` (PR title/desc) knows to run git diff main... to see the whole branch. The tool feels smart, not because the LLM is a genius, but because the tool itself is a good assistant.

2. Perfectly Tuned Prompts: You can't use the same system prompt to review code and to generate a commit message. One needs to be a critical engineer, the other a concise technical writer. By splitting them, each tool has a small, highly-optimized prompt that does its one job perfectly. No prompt-routing, no "you are a helpful assistant" fluff.

3. Reliable, Focused Evaluation: This is a huge engineering win. When a tool has one job, it's so much easier to evaluate. I can build a specific, high-quality test set for cm (commit messages) and another for cr (code review). I'm not trying to test a massive, do-it-all prompt; I'm testing a small, focused one, which makes it easier to measure quality and prevent regressions.

4. Simplicity (UX): The user experience is just... clean. You want a commit message? Type cm. You want a review? Type cr. No flags, no sub-commands, no cognitive overhead.

## My Family of Tools
Here's a peek at my local ~/bin directory:

* `qq`: Quick question. qq "how to find files modified in the last 2 days"
* `git ai-review`: Code review for the current git diff.
* `gcai`: Git commit message for staged files.
* `git pr`: Generate a PR title and description from the current branch's diff.
* `git conflict-fix`: Takes a file with git conflict markers (<<<<<) and attempts a clean merge.
* ... and many more

Each one is simple, fast, and does one thing.

## A Pro-Tip on Integration a.k.a. Live Where Your Context Is
Here’s an extra detail on how I build these. I don't just dump them all into ~/bin. I put them where they make the most sense.

1. For Git-centric tasks, we build Git sub-commands. Our code review tool is `git ai-review`. Our PR generator is `git pr`. This is a huge win for discoverability and ergonomics. The commands feel like a native part of Git because they operate on the Git repository. Anyone who knows Git (and types git --help) can find them, and they automatically operate within the context of the current repo.

2. For general tasks, we build standalone commands. My "quick question" tool is just qq. It would feel weird and clunky to type git qq "how do I unzip a file?". This tool has no concept of a repository, so it lives in the standard shell, right next to grep and ls.

This division is part of the same philosophy: design your tool for its specific job, and that includes its "home" on the command line.

## The Critical Base a.k.a. Don't Repeat Yourself
This all sounds great, but what about the maintenance nightmare? Do all 15 tools have their own API key logic? What if I want to swap gpt-4o for claude-3.5-sonnet?

This is the most important part: you must build a base implementation.

I have a single, local llm-cli-utils library. Every micro-tool is just a 20-line script that imports this base. The base library handles all the boring, critical stuff:

* Consistent CLI: All tools get the same --model or --verbose flags for free, using something like argparse or click.

* API Key Retrieval: It knows exactly where to find the OPENAI_API_KEY (or any other key) from the environment or a config file.

* Model Selection: The --model flag just works, everywhere.

* LLM Framework Abstraction: The base library handles the actual API call (using langchain, litellm, or just raw openai-python). If we want to add a new model provider, we change it in one place, and all tools get the upgrade instantly.

This is the way. You get the beautiful UX of small, specialized tools and the maintenance sanity of a single, shared core.

Stop building all-in-one AI behemoths. Start building small, sharp, Unix-style tools.
