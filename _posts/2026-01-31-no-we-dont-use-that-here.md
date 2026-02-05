---
layout: post
title: "No! We don't use that here! a.k.a. Making AI Coding NP-Complete"
date: 2026-01-31 12:00:00
categories: [ai, llm, software-engineering]
tags: [agents, fine-tuning, developer-experience]
updates:
  - date: 2026-02-05 10:00:00
    reason: "Standardized heading format and minor grammar fixes"
  - date: 2026-02-05 11:00:00
    reason: "Fixed citation to correct arXiv paper (2405.05904)"
  - date: 2026-02-05 12:00:00
    reason: "Added 'Knowledge Trap' section addressing fine-tuning critique"
---

We've all been there. You ask your shiny new AI Agent to "add a user profile endpoint," and it generates 50 lines of pristine, bug-free, idiomatic Python. 

And you hate it.

It's not that the code is *wrong*. It compiles. It runs. It passes tests. But it's... wrong.

*   "We don't use `FastAPI` dependency injection like that; we use our own `ServiceContainer`."
*   "Why is there a raw SQL query? We have a strict `LegacyQueryFramework` wrapper for that."
*   "Please don't introduce a new utility for date formatting; use `TimeUtils`."

So you write a comment. Then you edit the prompt. Then you update that massive `AGENTS.md` file that is rapidly becoming a novel. You are stuck in a loop of teaching the same lessons over and over again.

LLMs are incredible coders. But they are terrible employees — they forget.

They don't know "how things are done around here." And trying to teach them by shoving more and more context into the prompt is a losing battle. 

I think we're approaching this the wrong way. We're trying to solve an NP-Hard problem, when we should be solving an NP-Complete one.

# The Theory: Why Generation is NP-Hard

In computational complexity theory, [NP-Hard](https://en.wikipedia.org/wiki/NP-hardness) problems are those where finding a solution is extremely difficult. [NP-Complete](https://en.wikipedia.org/wiki/NP-completeness) problems are a special subset where *finding* the solution is hard, but *verifying* a proposed solution is efficient (polynomial time).

(Note: I'm using these terms loosely as a metaphor—the analogy isn't mathematically precise, but the intuition holds.)

Think about coding in that context.

Code Generation is NP-Hard.
When you ask an Agent to "write code that fits our organization's standards," you are asking it to search an infinite space of possible syntaxes, libraries, and architectural patterns to find the *one* specific combination that matches your organization's unwritten rules. To do this successfully, the Agent needs perfect knowledge of your entire codebase, your history, and your personal preferences. That is a massive search problem.
Not only that, but the Agent may find many different solutions that are all correct given the current context, but none of them are "good enough" - they all fail to meet the organization's actual, ever-evolving standards.

Code Verification is NP-Complete.
But if I show you a piece of code, you can instantly say: "No, don't use `GraphQL` here, use `LegacyQueryFramework`." 
Verifying if a solution fits expectations is cheap. You don't need to know how to write the perfect code to know that the current code is wrong.

Right now, we are asking our Agents to be perfect Generators. We are overloading them with context hoping they can "solve" the Style Problem in one shot. 

We should stop doing that. We should assume the Generation will be imperfect, and focus on building a really fast, really smart Verifier.

# Enter The "Reviewer" Model

Imagine a new architecture for AI coding. Instead of one massive "Do-It-All" model, we have two:

1.  The Writer: A capable, general-purpose frontier model. It knows Python, it knows logic, it knows how to solve problems. It doesn't know your specific internal style quirks, and *that's okay*.
2.  The Reviewer: A small, specialized model (e.g., a fine-tuned Gemma 2B or 7B). It might not be smart enough to write complex logic, but it has been fine-tuned on one thing: Your Code Reviews.

The workflow changes from "Prompt -> Code" to a loop:

1.  Writer generates a plan/code.
2.  Reviewer looks at it. It doesn't check for bugs, code syntax, format, etc. (we have other tools for that). It checks for *Taste*.
3.  Reviewer says: "This looks 3/10. Re-direct: We prefer to chain JavaScript promises here."
4.  Writer updates the code.
5.  Reviewer says: "8/10. Good enough."

The Reviewer doesn't need to know the right answer. It just needs to know that the current answer is wrong, and point the Writer in the right direction. We are effectively reducing the problem complexity: The Writer provides the raw intelligence; the Reviewer provides the constraints.

# The "Secret Sauce": Living Memory

"But wait," you ask, "Don't I still have to train this Reviewer? Isn't that just `AGENTS.md` with extra steps?"

No. Because you shouldn't be writing rules. You should just be doing your job.

We can harvest the training data for this Reviewer automatically from the "Exhaust" of your engineering org.

**Data Mining the "Taste":**

*   The "Squash & Merge" Delta: When an Agent opens a PR, and a developer eventually merges it, the *difference* between the Agent's original code and the final merged code is pure gold. It is a labeled dataset of "What the Model wanted" vs. "What the Org wanted."
*   The Comment Thread: Every time a senior engineer comments "Please use `logger` instead of `print`," that is a negative training example for `print` and a positive signal for `logger`.
*   IDE Shadowing: In a "Copilot" setting, if the AI suggests code and the user immediately backspaces and retypes it, that is a strong negative signal.
*   **Direct Feedback:** When you explicitly correct the Agent in chat, that is high-quality data. We could even add simple reaction emojis (👍/👎) to every Agent reply to gather "Taste" signals with zero friction.

We can feed this stream of stylistic preferences into a small model. This creates a Living Memory of the organization's taste. It evolves as you evolve. If you stop using `LegacyQueryFramework` and switch to `GraphQL`, the training data shifts, the Reviewer updates, and the Agents follow suit—without anyone updating a markdown file.

# The Logistics: Can We Actually Do This?

"Fine-tuning a model" sounds expensive and scary. It used to be. Today, it's a weekend project.

Here is the napkin math for building your organization's reviewer:

## 1. The Data
You don't need "Big Data." For a specialized classifier like this (Binary: "Good/Bad" or Classification: "Pass/Refactor"), you can see results with as few as **1,000 - 5,000 examples**.
*   *Source:* Your existing PR history.
*   *Labeling:* Automated scripts (e.g., "accepted without comments" vs "commented on").

## 2. The Model
*(as of January 2026—this list will likely be outdated soon)*
You don't need GPT-4. You need something small, fast, and verify-capable.
*   [**Gemma 2B / 7B**](https://blog.google/technology/developers/gemma-open-models/): Google's open models are excellent for this. The 2B version is tiny enough to run on almost any modern laptop.
*   [**Phi-3-mini**](https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-what-s-possible-with-slms/): Microsoft's 3.8B model packs a punch way above its weight class.
*   [**Llama 3 8B**](https://llama.meta.com/llama3/): A bit heavier, but widely supported and very capable as a generalized "Judge".

## 3. The Method
*(Disclaimer: I am not an expert in fine-tuning, so take this as a high-level overview)*
You won't retrain the whole model. You will use **PEFT** (Parameter-Efficient Fine-Tuning) techniques:
*   [**LoRA**](https://arxiv.org/abs/2106.09685) (Low-Rank Adaptation): Freezes the big model and trains tiny "adapter" layers.
*   [**QLoRA**](https://arxiv.org/abs/2305.14314): Does the above but with 4-bit quantization, allowing you to train on a single consumer GPU (like an NVIDIA T4 or RTX 4090).

## 4. The Cost
*   **Training:** On a cloud GPU (e.g., [T4 on Google Colab](https://cloud.google.com/compute/gpus-pricing) or AWS), a fine-tuning run for a small dataset takes <1 hour. Estimated cost: **<$5**. That's cheap enough to do re-training every week.
*   **Serving:** Serving a small model like Gemma or Llama 3B on a cloud provider costs roughly **$0.02–$0.10 per 1M tokens** (based on [Together AI pricing](https://www.together.ai/pricing)). Compared to GPT-4o input costs (~$2.50/1M tokens), it's negligible.

It is cheaper to run a custom-trained 2B parameter verification model than to jam 50k tokens of "Rules" into every GPT-4 prompt.

# The Knowledge Trap: Why Your Reviewer Doesn't Need a Library Card

The primary critique of fine-tuning—that it is a "leaky" and [inefficient way to inject factual knowledge compared to RAG](https://arxiv.org/abs/2312.05934)—actually reinforces the **Reviewer/Writer** split. The theory remains robust because it shifts the objective of fine-tuning from **Data Storage** to **Behavioral Alignment.**

## 1. Taste is a Pattern, Not a Fact

Fine-tuning is [notoriously poor at "memorizing" specific, isolated facts](https://arxiv.org/abs/2405.05904) (like a new API endpoint name), but it is exceptionally good at **Domain Adaptation.** "Taste" (organizational style, architectural preferences, idiomatic patterns) is a statistical distribution, not a lookup table. The Reviewer doesn't need to be an encyclopedia; it needs to be a **Filter** that recognizes the "shape" of acceptable code.

## 2. Training on the "Direction," Not the "State"

While RAG pulls from the current state of a codebase (which is often messy or full of legacy "noise"), the Reviewer is fine-tuned on the **Diffs**—the "Exhaust" of the PR process.

*   This allows the Reviewer to learn the **vector of improvement** (e.g., *“We are moving away from X and toward Y”*).
*   Because it learns the *correction* rather than the *static fact*, the inherent "lossiness" of fine-tuning becomes an advantage: it ignores the noise of the codebase and focuses on the signal of the organization’s evolution.

## 3. Decoupling "The Brain" from "The Conscience"

The Fine-Tuning Knowledge Gap only breaks a model if that model is expected to be the sole source of truth. In the **Reviewer Architecture**:

*   **The Writer (Frontier Model)** uses its massive scale and RAG to handle the **NP-Hard Generation** and factual knowledge.
*   **The Reviewer (Small Fine-Tuned Model)** handles the **Verification.**

By separating these concerns, the fact that a 2B parameter model isn't a great "database" doesn't matter—it only needs to be a great **judge.**

# Prior Art: It’s Not Just Theory

This isn't just a fun thought experiment. The biggest players in AI and Tech are already validating pieces of this puzzle.

## 1. The "Reviewer" Architecture Works (Google & Microsoft)
*   **Google** deployed a model trained purely on [resolving code review comments](https://research.google/blog/resolving-code-review-comments-with-ml/). It focuses on the "cleanup" phase—predicting the edit needed to satisfy a human reviewer—and achieved a 50%+ acceptance rate.
*   **Microsoft** [released CodeReviewer](https://arxiv.org/abs/2203.09095), a model pre-trained on the *interaction* of code reviews (Code Change → Review Comment). It proved that a model trained on diffs and comments beats a generic large model at spotting errors.

## 2. The Data Strategy Works (Meta)
*   **Meta** fine-tuned Llama on 64,000 internal `<Review Comment, Patch>` pairs ([MetaMate for Code Review](https://www.researchgate.net/publication/381062746_Resolving_Code_Review_Comments_with_Machine_Learning)). They found that fine-tuning a smaller model on their own *high-quality internal history* significantly outperformed massive generic models.

## 3. The Future is Reward Engineering (DeepSeek)
*   **DeepSeek-R1** (released Jan 2025) pioneered using large-scale Reinforcement Learning to force a model to "pause and verify" its own output ([Technical Report](https://github.com/deepseek-ai/DeepSeek-R1)). This is the logical endpoint of our Reviewer: training the "Taste" directly into the model's reward function.

# A New Kind of Feedback Loop

We are currently stuck in a local maximum of "Prompt Engineering"—trying to craft the perfect set of instructions to get the perfect result.

We need to move to **Reward Engineering**. We need to accept that "Taste" is hard to describe but easy to recognize. By building specialized models that act as automated Code Reviewers, we can finally scale the most unscalable part of software engineering: our culture.

We don't need generic speed; we need specific taste. It's time to clone our team's DNA.
