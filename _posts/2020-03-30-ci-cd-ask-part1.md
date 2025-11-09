---
layout: post
title: CI/CD at AnySoftKeyboard aka Is it ready to ship? Part 1
date:   2020-03-30 20:03:30
categories: [anysoftkeyboard, ci]
tags: [android, ci, static-analysis, tests, github]
---

Recently, I've [merged](https://github.com/AnySoftKeyboard/AnySoftKeyboard/pull/1991) several AnySoftKeyboard repositories into a [monorepo](https://en.wikipedia.org/wiki/Monorepo) - I'm a believer in the monorepo process. During that process, I also refined the Continuous Integration (CI)/Continuous Deployment (CD) process and wanted to give an overview of the process and the logic behind that.

This is the first of three parts:

1. Continuous Integration, aka _CI_.
1. Continuous Deployment, aka _CD_.
1. Complimenting workflows.

# Process
The CI/CD flow in AnySoftKeyboard starts when a pull request is submitted. Then, a series of checks are run, the code is reviewed, the pull request is merged, the checks are run again on the `main` branch, and finally, the changes are deployed to users.

The first five steps are the CI part, and the last is the CD part.

# Why CI - Continuous Integration
[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) is pretty much an industry-standard, and well-accepted. In essence, for every commit (or a set of commits, e.g., a pull request), we run unit-tests, static-analysis tools, and code-style verifications. These checks will ensure three things:

1. You are confident that your change did not break anything - hence you do not need to check _every_ possible scenario and use case.
1. The next developer who picks up your changes gets a healthy, readable, and working code, feeling confident that they can start working on their code-change.
1. With some confidence, any feature and use case are still working for end-users.

You'll notice that the keyword here is _confidence_. Continuous Integration gives us confidence that the `HEAD` commit of _main_ is valid and working as intended.

## Pull Requests
Every change will be proposed as a pull request. The system will then perform the following:

1. Assigning all relevant code-owners as reviewers according to the [`CODEOWNERS`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/main/.github/CODEOWNERS) file. Assigning is done automatically by [GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).
1. Running all checks. Defined in the [checks](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/main/.github/workflows/checks.yml) workflow.
1. Block merging until checks pass and code-review approved. This is configured in the _protected branch_ setting in the repository settings page.

## Checks
Checks are what make us confident that our code works and does not break any existing functionality is still working as before this proposed code change. Several types of checks run on each code-change.

### Tests
The most common check that we run is [unit-tests](https://en.wikipedia.org/wiki/Unit_testing). Essentially, unit-tests will verify that distinct pieces of code are doing what they are supposed to do correctly. For example, a test could verify that a Dictionary implementation can look up words and find typos.

We also run [integration-tests](https://en.wikipedia.org/wiki/Integration_testing), which ensure that different parts of the codebase work with each other as intended. For example, a test that given a user interaction with the keyboard view a specific text is printed in the Android's text box.

We write tests in two main cases:

1. New functionality that we want to verify that is doing what we wanted: for each possible input category (or for each internal code branch), we have a test.
1. A bug fix that we want to verify that it won't regress.
These types of tests provide us with the most confidence in our code.

Note that tests cover the behavior of the code, and only the branches we individually coded in the test. So, of course, this is not complete.

### Static-Analysis
Even if your code works under typical use-cases and all tests pass, it does not mean it is correct. [Static-Analysis](https://en.wikipedia.org/wiki/Static_program_analysis) tools can search your codebase for common programming issues. Such issues could be an incorrect use of an external API or assuming something is not null when it could.

In AnySoftKeyboard, we use:

* [Error-Prone](https://github.com/google/error-prone), with an Android-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/main/gradle/errorprone.gradle). Error-Prone is a fast checker that can find many Java-related code smells. It is widely popular and actively maintained.
* [Lint](https://developer.android.com/studio/write/lint) with an AnySoftKeyboard-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/main/configs/lint.xml). Lint is the gold-standard in Android-centric code and resources static-analysis. It is well-known and actively maintained.
* [checkstyle](https://checkstyle.org/) with an AnySoftKeyboard-specific [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/tree/main/configs/checkstyle). Another well-known Java code analysis. We use it to find illegal/undesirable code usage and files.
* [Google-Java-Format](https://github.com/google/google-java-format). This tool ensures that the code style across the codebase is defined well and maintained. It also supports automatic formatting, so win-win.

Of course, many other tools can be used. A few notable mentions:

* [PMD](https://pmd.github.io/).
* [FindBugs](http://findbugs.sourceforge.net/)/[SpotBugs](https://spotbugs.github.io/). FindBugs seems to be dead, so maybe use SpotBugs, if interested.
* [Mutation-Testing](https://pitest.org/).

For us, we decided to focus on a few, very popular and fast, static-analysis to reduce the complexity of the check suite and the requirements from the developers.

## Cache
A side-note. A lot is going on here; compiling production code, debug code and tests, running tests, and several tools on top of that code. This process could be slow, both in the CI environment and in the local developer environment. To that end, it is crucial to pick a build system and tools that support caching (that is, do not execute actions if the input has not changed) and configure them correctly.
Luckily, Gradle has an excellent [caching](https://docs.gradle.org/current/userguide/build_cache.html) mechanism (as long as your system is not too complicated): it will cache compilation steps and test runs.
Error-Prone is running inside the compilation step, so we get caching for free here.
Lint also has an excellent caching mechanism, relying on Gradle's caching mechanism.

Another benefit of caching is that faster feedback makes developers happier. Like, much much happier.

### Persistent Cache
Gradle will store its cache on disk (there is an option to use [remote cache](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_setup_http_backend), under a specified path. Gradle is using this disk cache in sequential runs to skip actions that have run in the past. This state is called _warm cache_ - skipping a step because you already have the result of it in the cache.

Keeping your local cache warm, is easy, and happens as you build locally. But, on CI, it's a bit harder since every time you run a job on CI, you will get a different machine, one that does _not_ have any cache related to your build. Run checks without cache means much slower checks.

Since we are using [Github Workflows](https://docs.github.com/en/actions/managing-workflow-runs), we can specify where is our cache is located, how to identify its version, etc. See our checks-workflow [configuration](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/master/.github/workflows/checks.yml) for details.

For AnySoftKeyboard, running the PR checks without cached can take up to 20 minutes, while about 8 minutes with the cache warmed.

### Docker
Caching relies on the assumption that if the input is the same, the action will produce the same output. This assumption is true only if:
The inputs are defined correctly.
The action only uses the inputs to produce the output.
If both these guidelines apply, then the action is defined as _hermetic_.

As a rule, Gradle is _not_ a hermetic build system ([bazel](https://bazel.build/), for example, is), but it does an outstanding job nonetheless.

To reduce the chances of a misbehaving action, we'll use Docker in CI, so Gradle will have the same environment during its execution. Same Java, same bash, same SDK, same NDK, etc.

We are using an [image](https://hub.docker.com/r/menny/ndk_ask/tags) that is built explicitly for AnySoftKeyboard. This image uses [Java10](https://hub.docker.com/r/adoptopenjdk/openjdk10/tags) (this helps ErrorProne run faster), has the required SDK, NDK and build-tools all preinstalled and ready to go. Check out the [Dockerfile](https://github.com/menny/docker_android/blob/main/android_ndk/Dockerfile) for this image and the [CI build script](https://github.com/menny/docker_android/blob/main/.circleci/config.yml) on [GitHub](https://github.com/menny/docker_android).

As a side note, I would mention that it's pretty easy to create a custom image and store it in on [Docker Hub](https://ropensci.github.io/r-docker-tutorial/).


# To be continued
What will happen to our pull request? How will it be integrated into the _main_ branch? And, how will it reach end-users?
Stay tuned for the next parts.
