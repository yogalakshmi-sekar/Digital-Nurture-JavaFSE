# Hands-On 4 — Conflict Resolution

**Objectives:** resolve a merge conflict that happens when master and a branch both modify the same file.

**Prerequisites:** Hands-On ID "Git-T03-HOL_001" (branching & merging) completed.

**Estimated time:** 30 minutes

## Steps

```bash
# 1. Verify master is clean before starting
git checkout master
git status

# 2. Create a branch and add hello.xml with some content
git checkout -b GitWork
cat > hello.xml << 'EOF'
<root>
  <version>1.0</version>
  <message>Hello from GitWork branch</message>
</root>
EOF

# 3. Check status, then commit the change on GitWork
git status
git add hello.xml
git commit -m "Add hello.xml on GitWork branch"

# 4. Switch to master
git checkout master

# 5. Add hello.xml to master too, with DIFFERENT content
cat > hello.xml << 'EOF'
<root>
  <version>2.0</version>
  <message>Hello from master branch</message>
</root>
EOF
git add hello.xml
git commit -m "Add hello.xml on master with different content"

# 6. Observe both histories diverging
git log --oneline --graph --decorate --all

# 7. Check the plain-text differences
git diff master GitWork -- hello.xml

# 8. Visual diff with P4Merge
git difftool -t p4merge master GitWork -- hello.xml

# 9. Merge GitWork into master — THIS WILL CONFLICT because both
#    branches changed the same lines of hello.xml
git merge GitWork
```

**Expected output at step 9:**
```
Auto-merging hello.xml
CONFLICT (content): Merge conflict in hello.xml
Automatic merge failed; fix conflicts and then commit the result.
```

`hello.xml` now contains Git's conflict markers, e.g.:

```xml
<root>
<<<<<<< HEAD
  <version>2.0</version>
  <message>Hello from master branch</message>
=======
  <version>1.0</version>
  <message>Hello from GitWork branch</message>
>>>>>>> GitWork
</root>
```

```bash
# 10. Resolve using the 3-way merge tool (opens P4Merge with base/local/remote)
git mergetool -t p4merge

# 11. After resolving manually in the editor/mergetool, stage and commit
git add hello.xml
git commit -m "Resolve merge conflict in hello.xml"

# 12. git mergetool leaves a .orig backup file — check status and ignore it
git status
echo "*.orig" >> .gitignore
git add .gitignore
git commit -m "Ignore backup files created during conflict resolution"

# 13. List branches, then delete the merged one
git branch -a
git branch -d GitWork

# 14. Confirm the final history
git log --oneline --graph --decorate
```

**Expected output:** the conflict markers are gone from `hello.xml`, the file contains the manually reconciled content, `git status` is clean after the `.gitignore` commit, and `git log --oneline --graph --decorate` shows a merge commit joining `GitWork` back into `master`.

## Deliverable in this folder

- `hello.xml` — the final, conflict-resolved version of the file.
- `.gitignore` — updated to also exclude `*.orig` backup files left behind by the merge tool.
