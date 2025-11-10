---
layout: post
title: "CI/CD at AnySoftKeyboard Part 2 aka Ship It!"
date:   2025-11-09 12:00:00
categories: [anysoftkeyboard, cd]
tags: [android, cd, deployment, github, play-store, alpha, beta, stable]
---

In [Part 1 of this series](/2020/03/30/ci-cd-ask-part1.html), we discussed how Continuous Integration (CI) at AnySoftKeyboard ensures that our `main` branch is always in a healthy, shippable state. Through rigorous testing, static analysis, and code style checks, we gain the confidence that our code is robust and ready for prime time.

But what good is a perfectly integrated codebase if it never reaches our users? This is where [Continuous Deployment](https://en.wikipedia.org/wiki/Continuous_deployment) (CD) comes into play. In this second part, we'll dive into how AnySoftKeyboard automates the process of getting our application from our `main` and release branches directly into the hands of our users.

# Why Continuous Deployment? The Need for Speed and Feedback

The primary goal of Continuous Deployment is to make the release process routine, reliable, and, most importantly, fast. Instead of infrequent, high-stress "release days," CD allows us to deliver value to users continuously.

For AnySoftKeyboard, this means:

*   **Faster Feedback from Alpha and Beta Users**: By deploying frequently to our Alpha and Beta channels, we get new features and bug fixes into the hands of our most engaged users almost immediately. This rapid feedback loop is invaluable for validating new functionality, identifying regressions, and ensuring a high-quality user experience before a wider release.
*   **Quick Delivery of Features and Fixes**: When a critical bug is found or a highly anticipated feature is ready, CD enables us to push it out to users with minimal delay, maximizing impact and user satisfaction.
*   **Reduced Risk**: Each deployment is a small, incremental change, making it easier to identify and roll back issues if they arise, compared to large, infrequent releases.

# Our Deployment Triggers: Different Cadences for Different Audiences

AnySoftKeyboard employs a multi-channel deployment strategy, each with its own trigger and audience, allowing us to balance rapid iteration with stability.

### Alpha Channel (The Cutting Edge)

*   **Metric**: Deployment to Alpha takes approximately **15 minutes** from merge to Play Store.
*   **Pointer**: The Alpha deployment is kicked off by the `checks.yml` workflow, which runs on every push to the `main` branch. After all checks pass, it triggers a deployment request.
*   **Snippet**: This process is defined in [`.github/workflows/checks.yml`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/.github/workflows/checks.yml). The workflow triggers on a `push` to `main`, and if all checks pass, the final `deploy-request` job is executed to initiate the Alpha deployment.

### Beta Channel (The Weekly Digest)

*   **Pointer**: The Beta promotion is handled by a scheduled workflow that runs daily, but the promotion itself is gated to only happen on Wednesdays.
*   **Snippet**: The schedule is defined in [`.github/workflows/deployment_promote.yml`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/.github/workflows/deployment_promote.yml):   

```yaml
# In .github/workflows/deployment_promote.yml
on:
    schedule:
    - cron: '04 04 * * *' # Runs daily at 04:04 UTC
```

This workflow triggers our custom deployment tool, which contains the gating logic in [`js/github_deployments/deployment_config.ts`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/js/github_deployments/deployment_config.ts). The `promoteOnWednesday` function ensures the promotion to the Beta channel only proceeds when the job runs on a Wednesday.

### Stable Channel (The Official Release)

*   **Metric**: Our stable rollout completes over **5 days**: 10% → 20% → 50% → 100%.
*   **Pointer**: The Stable release process is triggered not by a Git tag, but by a push to a specifically named *branch*, like `release-branch-ime-v1.12-r1`. This kicks off a time-based, gradual rollout.
*   **Snippet**: The `checks.yml` workflow is also configured to run on pushes to release branches, as seen in [the same file](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/.github/workflows/checks.yml):

```yaml
# In .github/workflows/checks.yml
on:
    push:
    branches:
        - 'release-branch-*-v*.*-r*'
```

Our deployment script then uses a regular expression (`/^release-branch-ime-.*$/`) in [`js/github_deployments/deployment_config.ts`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/js/github_deployments/deployment_config.ts) to identify this as a Production release, which begins the automated, multi-day staged rollout.

# The Brains of the Operation: Our `github_deployments` Tool

While GitHub Actions define the "when" of our deployments, the "what" and "how" are orchestrated by a custom, in-house TypeScript tool located at [`js/github_deployments`](https://github.com/AnySoftKeyboard/AnySoftKeyboard/tree/604834d25345cccb033e815f93234625bce64d2e/js/github_deployments). This command-line tool, executed via Bazel, acts as the central brain for our entire CD process.

Its primary responsibilities are:

1.  **Interpreting Triggers**: It consumes the branch name (e.g., `main`, `release-branch-...`) and determines which deployment configuration to use (Alpha, Beta, or Production).
2.  **Calculating Rollout Steps**: For our time-based rollouts, it calculates the current day of the release and selects the correct rollout percentage from a predefined array.
3.  **Interacting with the GitHub API**: It creates the official `deployment` events using the GitHub API, which in turn trigger the `deploy.yml` workflow. It's also used to report the status back to GitHub.

For example, when the `checks.yml` workflow runs on a `main` branch push, it executes the following command:

```bash
# This command is wrapped in our .github/actions/deploy-request action
bazel run //js/github_deployments -- deploy \
  --refname="main" \
  --deployMode="force_new" \
  # ... other parameters
```

This command tells our tool to create a new "Alpha" deployment. This layer of abstraction allows us to keep our deployment logic in well-tested TypeScript code, rather than in complex and hard-to-maintain YAML files.

# Executing the Release: The Magic of Automation

Regardless of the trigger, the actual process of building, signing, and publishing the application is entirely automated. Once a deployment is triggered, a dedicated GitHub Actions workflow takes over.

This workflow executes a series of scripts that perform all the necessary steps:

1.  **Building the Application**: The latest code is compiled and packaged into an Android App Bundle (`.aab`).
2.  **Secure Signing**: Signing keys and API credentials, stored as encrypted GitHub Secrets, are injected at build time. The App Bundle is then cryptographically signed using these credentials to ensure its authenticity and integrity.
3.  **Publishing to Google Play**: The signed App Bundle is uploaded to the Google Play Store. This entire process is handled via programmatic API calls to the Google Play publishing APIs, powered by the [`gradle-play-publisher`](https://github.com/Triple-T/gradle-play-publisher) plugin. This eliminates manual uploads, reduces human error, and ensures a consistent, reliable deployment every time.

The key here is that no human intervention is required for these steps. The automation handles everything, from compiling the code to interacting with the Play Store's backend.

# Closing the Loop: Visibility and Supporting Tools

An automated deployment process is only effective if it provides clear visibility into its status. For AnySoftKeyboard, various tools and mechanisms are in place to provide this feedback directly within our development workflow.

*   **Deployment Status Updates**: We use our `github_deployments` tool to communicate with the GitHub Deployments API. The same tool that initiates a deployment is also called at various stages within the main `deploy.yml` workflow to report back the status. For example, as soon as a deployment begins, we run the following command to set the status to "in progress":

```bash
# In .github/workflows/deploy.yml
bazel run //js/github_deployments -- status \
    --deployment-id="${{ github.event.deployment.id }}" \
    --state=in_progress
```

This immediately updates the deployment status in the GitHub UI, providing real-time feedback.

*   **Automated GitHub Releases**: After a successful deployment to the Google Play Store, a dedicated `post_deployment` job in our [`deploy.yml` workflow](https://github.com/AnySoftKeyboard/AnySoftKeyboard/blob/604834d25345cccb033e815f93234625bce64d2e/.github/workflows/deploy.yml) handles the creation of a public-facing GitHub Release. Interestingly, this is a two-step process. When the stable rollout first begins (at 10%), we use the popular [`softprops/action-gh-release`](https://github.com/softprops/action-gh-release) action to create a **Pre-release**.

```yaml
# In .github/workflows/deploy.yml
- name: Create GitHub Pre-Release
  if: endsWith(needs.deploy.outputs.deployment_environment, '_010')
  uses: softprops/action-gh-release@v2.4.1
  with:
    prerelease: true
    # ... other parameters
```

Once the rollout successfully completes and reaches 100% of users, a later step in the same job updates the release, removing the "pre-release" flag. This ensures the official release notes are only marked as "Latest" when the deployment is fully complete.

```yaml
# In .github/workflows/deploy.yml
- name: Update GitHub Release to Stable
    if: endsWith(needs.deploy.outputs.deployment_environment, '_100')
    run: gh release edit "${{ env.TAG_NAME }}" --prerelease=false
```

These mechanisms ensure that while the deployment itself is automated, the development team remains fully informed and can quickly react to any issues.

# To be continued...

In the next and final part of this series, we'll explore the "Complimenting Workflows" that support our core CI/CD pipeline. These include other automation tasks that enhance developer experience, maintain code quality, and ensure the overall health of the AnySoftKeyboard project. Stay tuned!
