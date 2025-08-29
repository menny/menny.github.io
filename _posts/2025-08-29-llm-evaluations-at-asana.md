---
layout: post
title: "LLM Evaluations or How We Avoid Wat-Did-You-Say Moments"
date:   2025-08-29 12:00:00
categories: [ai, llm, asana]
tags: [evaluations, testing, quality, aicamp]
---

A few weeks ago, I had the pleasure of presenting at an [AI-Camp event](https://www.aicamp.ai/event/eventdetails/W2025062614) hosted at the Asana office in NYC. The topic was "LLM Evaluations: How we ensure AI tools produce consistent quality." I wanted to share some of the key takeaways from that presentation here.

You can find the slides from the presentation [here](/assets/llm-pres.pdf).

## The Problem with Evaluating LLMs

We all know how to test traditional software. We write unit tests, integration tests, and end-to-end tests. These tests are deterministic, objective, and easy to run. However, LLMs are not like traditional software. They are:

*   **Not deterministic:** The same input can produce different outputs.
*   **Not objective:** It's hard to define a single "correct" output.
*   **Quite a lift to run:** Evaluating LLMs can be time-consuming and resource-intensive.

So, how do we ensure the quality of our LLM-based tools?

## AI as a Judge

One solution we've found effective at Asana is using an "AI as a Judge." Instead of asking humans to evaluate every output of our internal AI tool, `z chat`, we use another AI to do the judging. This approach has several advantages:

*   **Easy to scale:** We can run evaluations on a large number of examples without human intervention.
*   **Consistent:** While not deterministic, the judge is very consistent when using the same model, prompt, and questions.
*   **Easy to automate:** We can easily integrate this into our CI/CD pipeline.

This approach is similar to what's being used in AI Studio and other places in the industry.

## OpenEvals and LangChain

To implement our AI Judge, we use [OpenEvals](https://github.com/langchain-ai/openevals), a framework from LangChain that helps us write evaluations for AI applications. With OpenEvals, we can define criteria for correctness, conciseness, and other quality metrics, and then use an LLM to score the output of our `z chat` tool.

Here's a simplified look at our evaluation flow:
1.  We have a set of evaluation data, which includes questions and criteria for correct answers.
2.  For each question, our simulator calls `z chat` to get a response.
3.  The response, along with the criteria and a judging prompt, is sent to our AI Judge.
4.  The judge provides a grade, which we use to score the quality of the `z chat` response.

## Findings and Next Steps

We currently have 32 evaluation cases and are seeing a response score of around 72% and a document retrieval score of 90%. This process has helped us identify several issues, such as missing ownership data and test cases that were failing despite the data being available to the LLM. We've also been able to improve our system's prompt to get better results.

This is an ongoing process, and we're continuously adding new evaluation cases and refining our prompts and models to improve the quality of our AI tools.

If you're working with LLMs, I highly recommend setting up an evaluation framework. It's a great way to ensure the quality and consistency of your AI applications.
