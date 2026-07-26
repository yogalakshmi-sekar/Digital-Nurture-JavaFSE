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

**Expected output:** `git branch -a` shows `* GitNewBranch` and `master` in the list. After the commit, `git status` reports a clean working tree on `GitNewBranch`.

## Merging

```bash
# 1. Switch back to master
git checkout master

# 2. List command-line differences between master and the branch
git diff master GitNewBranch

# 3. Visual diff using P4Merge
git difftool -t p4merge master GitNewBranch

# 4. Merge GitNewBranch into master
git merge GitNewBranch

# 5. Observe the merge history graph
git log --oneline --graph --decorate

# 6. Delete the now-merged branch and confirm
git branch -d GitNewBranch
git status
git branch -a
```

**Expected output:** `git diff` shows `branch-file.txt` being added. After `git merge`, `branch-file.txt` exists on master and `git log --oneline --graph --decorate` shows the branch history merging into master. `git branch -d` succeeds without a warning (since the branch was fully merged), and `git branch -a` no longer lists `GitNewBranch`.

## Deliverable in this folder

- `branch-file.txt` — the file created on `GitNewBranch` and merged into master.
