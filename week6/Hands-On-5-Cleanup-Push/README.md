# Hands-On 5 — Cleanup and Push to Remote

**Objectives:** clean up local branches and push all pending work back to the remote repository.

**Prerequisites:** Hands-on ID "Git-T03-HOL_002" (conflict resolution) completed.

**Estimated time:** 10 minutes

## Steps

```bash
# 1. Verify master is in a clean state (no uncommitted changes)
git status

# 2. List all available branches — after Hands-On 4's cleanup, only
#    master (and origin/master) should remain
git branch -a

# 3. Pull the latest remote changes into master before pushing, to
#    avoid a rejected push if anyone else has updated the remote
git pull origin master

# 4. Push all the commits from Hands-On 4 (conflict resolution, the
#    .gitignore update, etc.) up to the remote repository
git push origin master
```

**Expected output:**
- `git status` → `nothing to commit, working tree clean`.
- `git branch -a` → only `master` locally, matching `origin/master`.
- `git pull` → `Already up to date.` (if no one else pushed in the meantime) or fast-forwards master with any new remote commits.
- `git push` → uploads the local commits; output ends with something like:
  ```
  To https://github.com/<user>/<repo>.git
     a1b2c3d..e4f5g6h  master -> master
  ```

## Verify

Refresh the remote repository page in the browser and confirm:
- The commit history shows the merge commit and conflict-resolution commit from Hands-On 4.
- `hello.xml` and the updated `.gitignore` are present with their final content.
- The `GitNewBranch` and `GitWork` branches no longer exist remotely either (delete them on the remote UI if `git push` didn't already prune them, or run `git push origin --delete GitWork` if needed).

## Deliverable in this folder

- `terminal-output.txt` — real `git status`, `git branch -a`, and `git log --oneline --graph --decorate --all` output confirming the local repo (with all of Hands-On 3 and 4's history) is clean and ready. The `git pull`/`git push` section in that file is the expected output format for those two commands — run them for real against your own GitHub/GitLab remote URL and their actual output will look like this.
