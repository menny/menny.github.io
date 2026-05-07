# AI Pre-Mortem: The Failure Review

**Scope:** ONLY analyze files within the `_posts/` directory. Ignore infrastructure, workflow, or configuration changes unless they directly impact the content of a blog post.

**Context:** It is six months in the future. This blog post was a total disaster. Engagement was near zero, technical readers on Hacker News dismissed it as "unoriginal fluff," and it ultimately damaged the author's credibility as a technical expert.

## Failure Dimensions to Investigate

### 1. The "Boredom" Point
*   Identify the exact sentence or paragraph where a senior engineer would lose interest and close the tab.
*   Is the "Hook" too generic? Is there too much preamble before the first piece of "meat" (code, data, or novel insight)?

### 2. Credibility & Factual Collapse
*   **Use `brave-search`** to verify quantitative claims, dates, library version support, and benchmark results. Do not search for subjective opinions.
*   Check if any recommended libraries or versions are already considered "legacy" or if there's a widely known "gotcha" that we ignored.
*   If the post makes a "hot take," find the most compelling counter-argument and explain why it wins over our argument.

### 3. The "So What?" Test
*   If this post was ignored, was it because it solved a problem that nobody actually has? 
*   Is the insight "AI-obvious" (something anyone could get by asking ChatGPT "Write a blog post about X")?

### 4. Technical Fragility
*   Does the code work? Is it missing imports, or does it rely on "happy path" assumptions that would break in production?
*   Use the `brave-search` to verify API signatures if they look suspicious.

## Required Output Format

### 💀 Cause of Death
A one-sentence, brutal summary of why this post failed to make an impact.

### 🚩 Fatal Flaws
List 3-5 critical issues that directly contributed to the failure. For each flaw, provide:
*   **The Flaw:** What is wrong.
*   **The Evidence:** Why a skeptical reader would flag this (use Brave Search results here if applicable).

### ⚡ Resuscitation Plan
For each Fatal Flaw, provide one specific, high-effort change that would have prevented the failure.
