---
layout: post
title: CI/CD at AnySoftKeyboard a.k.a. Is it ready to ship? Part 1
date:   2020-03-30 20:03:30
categories: [anysoftkeyboard, ci]
tags: [android, ci, static-analysis, tests, bots, github, github-actions]
---

Recently, I've [merged](https://github.com/AnySoftKeyboard/AnySoftKeyboard/pull/1991) several AnySoftKeyboard repositories into a monorepo/monolithic-repository - I'm a believer in the [monorepo](https://en.wikipedia.org/wiki/Monorepo) process. During that process, I also refined the [CI](https://en.wikipedia.org/wiki/Continuous_integration)/[CD](https://en.wikipedia.org/wiki/Continuous_deployment) process and wanted to give an overview of the process and the logic behind that.

This is the first part out of three:

1. CI - Continuous Integration.
1. CD - Continuous Deployment.
1. Complimenting workflows.

# Process
The CI/CD flow in AnySoftKeyboard is as follows:
Pull-request submitted -> Checks passed -> Code reviewed -> Pull-request merged -> Checks run on _master_ -> Deployed to users.

The first five are the CI part, and the last is the CD part.

# Why CI - Continuous Integration

[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) is pretty much an industry-standard, and well-accepted. In essence, for every commit (or a set of commits, e.g., pull-request), we run unit-tests, static-analysis tools, and code-style verifications. These checks will ensure three things:

1. You are confident that your change did not break anything - hence you do not need to check _every_ possible scenario and use-case.
1. The next developer that picks up your changes gets a healthy, readable, and working code, feeling confident that they can start working on their code-change.
1. With some confidence, any feature and use-case are still working for end-users.

You'll notice that the keyword here is _confidence_. Continuous Integration gives us confidence that the `HEAD` commit of _master_ is valid and working as intended.

## Pull Requests

Every change will be proposed as a pull-request. The system will then perform the following:

1. Assigning all relevant code-owners as reviewers according to the [`CODEOWNERS`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/master/.github/CODEOWNERS) file. Assigning is done automatically by [github](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners).
1. Running all checks. Defined in the [checks](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/master/.github/workflows/checks.yml) workflow.
1. Block merging until checks pass and code-review approved. This is configured in the _protected branch_ setting in the repository settings page.

## Checks
Checks are what makes us confident that our code works and does not break any existing functionality is still working as before this proposed code-change. Several types of checks run on each code-change.

### Tests
The most common check that we run is [unit-tests](https://en.wikipedia.org/wiki/Unit_testing). Essentially, unit-tests will verify that distinct pieces of code are doing what they suppose to do correctly. For example, a test could verify that a Dictionary implementation can look up words and find typos.

We also run [integration-tests](https://en.wikipedia.org/wiki/Integration_testing), which ensure that different parts of the code-base work with each other as intended. For example, a test that given a user-interaction with the keyboard-view a specific text is printed in the Android's text-box.

We write tests in two main cases:

1. New functionality that we want to verify that is doing was we wanted: for each possible input category (or for each internal code branch), we have a test.
1. A bug fix that we want to verify that won't get regress back.
These types of tests provide us with the most confidence in our code.

Note that tests cover the behavior of the code, and only the branches we individually coded in the test. So, of course, this is not complete.

### Static-Analysis

Even if your code works under typical use-cases and all tests pass, it does not mean it is correct. [Static-Analysis](https://en.wikipedia.org/wiki/Static_program_analysis) tools can search your code-base for common programming issues. Such issues could be an incorrect use of an external API or assuming something is not-null when it could.

In AnySoftKeyboard, we use:

* [Error-Prone](https://github.com/google/error-prone), with an Android-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/master/gradle/errorprone.gradle). Error-Prone is a fast checker that can find many Java-related code-smells. It is widely popular and actively maintained.
* [Lint](https://developer.android.com/studio/write/lint) with an AnySoftKeyboard-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/master/configs/lint.xml). Lint is the gold-standard in Android-centric code and resources static-analysis. It is well-known and actively maintained.
* [checkstyle](https://checkstyle.org/) with an AnySoftKeyboard-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/tree/master/configs/checkstyle). Another well-known Java code-analysis. We use it to find illegal/undesirable code usage and files.
* [Google-Java-Format](https://github.com/google/google-java-format). This tool ensures that the code-style across the code-base is defined well and maintained. It also supports automatic formatting, so win-win.

Of course, many other tools can be used. A few notable mentions:

* [PMD](https://pmd.github.io/).
* [FindBugs](http://findbugs.sourceforge.net/)/[SpotBugs](https://spotbugs.github.io/). FindBugs seems to be dead, so maybe use SpotBugs, if interested.
* [Mutation-Testing](https://pitest.org/).

For us, we decided to focus on a few, very popular and fast, static-analysis to reduce the complexity of the checks-suite and the requirements from the developers.

# To be continued

What will happen to our pull-request? How will it be integrated into the _master_ branch? And, how will it reach end-users?
Keep watch for the next parts.
