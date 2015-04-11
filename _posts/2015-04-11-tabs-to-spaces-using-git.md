---
layout: post
title: Tabs to Spaces in a GIT repo a.k.a If everyone is Doing It, I'm Doing It Too
date:   2015-04-11 13:52:00
categories: [android, git, code-style]
tags: [git]
---
I work on a few projects right now, some using the [Android code-style](https://source.android.com/source/code-style.html) and some their [own](http://robolectric.org/contributing/). This is very confusing, and always causes problems when pushing a commit for merge.<br>

I'm trying to consolidate all the projects into Android's code-style. Specifically, _no-tabs_ and _4 spaces indents_.

# Game Plan #
Going over all the files and changing the tabs to spaces is, of course, not an options. More over, we do not want our name on every single `git blame` code line! So, we'll need to convert all the tabs to spaces, ensure all indentation is 4 spaces, and re-write history to hide it.

## Prerequisites ##
 * Linux or Mac OSX machine. If you know how to do it under Windows, please leave a comment.
 * You'll need `git push -f` permission to the remote repo. That's the only way to re-write history.
 * `expand` should be installed on you machine

## Switching Tabs to 4 Spaces ##
`find . -name '*.java' ! -type d -exec bash -c 'expand -t 4 "$0" > /tmp/e && mv /tmp/e "$0"' {} \;`<br>

Here's what we are doing with that command:

 * _find_ all the **Java** files in the repo.
 * On each file, execute `expand` (using `bash`) which will convert tab characters to 4 spaces, and save into a temporary file.
 * The move the temporary file to overwrite the original file.
 * If you also want to convert your _XML_ files to spaces, then run the same command with `*.xml` filter.

## Commit the Changes ##
`git add .`<br>
`git commit -m "converting tabs to spaces"`<br>
Now, we have a commit in our local git repo that holds all the changes. Let's get the hash for the commit using `git rev-parse HEAD`. For our example, let's say it is `0867e54002195d16dbfb69076d1df2d8b1f83e6f`.

## Re-write git History ##
`git filter-branch --tree-filter 'git diff-tree --name-only --diff-filter=AM -r --no-commit-id 0867e54002195d16dbfb69076d1df2d8b1f83e6f' HEAD`<br>
This is the cool part: hiding all the evidence that you made the switch. This will ensure that when developers check `git blame` on a file, the _tabs->spaces_ changes will not show.<br>
This takes _a very long time_ to run. The bigger the repo the longer it will take.

## Force push to _master_ ##
`git push -f origin master`<br>
Pushing to the remote repo (be it _origin_ or _upstream_).
<br>

# Possible Problems #
 * Applying the `filter-branch` may fail ("Cannot create a new backup.") because of an existing backup in your _refs_ folder. Delete those with `rm -rf .git/refs/original/refs/heads/master` from the root of your repo.
 * If you get `! [rejected]        master -> master (non-fast-forward)` when pushing the changes to your git repo, it means that you do not have _force push_ permissions in the git repo. Talk to the owner.
