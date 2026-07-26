# Hands-On 3 — Branching and Merging

**Objectives:** create a branch, make changes on it, and merge it back into master/trunk; understand branch/merge requests in GitLab/GitHub.

**Prerequisites:** Git environment set up, with the P4Merge tool installed for visual diffs (Windows).

**Estimated time:** 30 minutes

## Branching

```bash
# 1. Create a new branch
git checkout -b GitNewBranch

# 2. List all local and remote branches — the "*" marks the branch you're on
git branch -a

# 3. You're already switched onto GitNewBranch (checkout -b does both).
#    Add a file with some content.
echo "This file was added on GitNewBranch." > branch-file.txt

# 4. Commit the change
git add branch-file.txt
git commit -m "Add branch-file.txt on GitNewBranch"

# 5. Check status
git status
```

## Merging

To make the merge realistic (not just a fast-forward), master also gets a commit of its own before merging back — this is what makes `git merge` actually create a merge commit, which is what "observe the logging after merging" is meant to show you.

```bash
# 1. Meanwhile, back on master, make an unrelated commit
git checkout master
echo "v1.1" > version.txt
git add version.txt
git commit -m "Bump version on master"

# 2. List command-line differences between master and the branch
git diff master GitNewBranch

# 3. Visual diff using P4Merge
git difftool -t p4merge master GitNewBranch

# 4. Merge GitNewBranch into master
git merge GitNewBranch -m "Merge branch 'GitNewBranch' into master"

# 5. Observe the merge history graph
git log --oneline --graph --decorate --all

# 6. Delete the now-merged branch and confirm
git branch -d GitNewBranch
git status
git branch -a
```

**Actual result (see `terminal-output.txt` for the full real run):** because master and `GitNewBranch` had each moved forward independently, `git merge` produced a genuine merge commit (`Merge made by the 'ort' strategy.`) instead of a fast-forward. `git log --oneline --graph --decorate --all` shows the two branches (`a00a587` on master, `cd6e140` on GitNewBranch) joining at the merge commit. `git branch -d` succeeds cleanly since the branch was fully merged, and `git branch -a` no longer lists `GitNewBranch` afterward.

## Deliverable in this folder

- `branch-file.txt` — the file added on `GitNewBranch`.
- `version.txt` — the file added on `master` while the branch existed, which is what forces a real merge commit instead of a fast-forward.
- `terminal-output.txt` — the real captured terminal output for the entire flow above, including the actual merge commit and `git log --graph` output.
