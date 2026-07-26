# Hands-On 2 — .gitignore

**Objectives:** understand `.gitignore` and use it to keep unwanted files/folders out of a Git repository.

**Prerequisites:** Git environment set up, Notepad++ as default editor, a local repo linked to a remote (from Hands-On 1).

**Estimated time:** 20 minutes

## Task

Create a `.log` file and a `log` folder in the working directory. Update `.gitignore` so that both — files with a `.log` extension, and the entire `log` folder — are ignored on commit. Then verify with `git status` that the working directory, local repo, and (eventually) remote repo all agree these files should not be tracked.

## Steps

```bash
# From inside the repo working directory
# 1. Create a stray log file
echo "app started" > app.log

# 2. Create a log folder with a file inside it
mkdir log
echo "debug trace" > log/debug.log

# 3. Check status BEFORE ignoring anything — both should show as untracked
git status
```

**Expected output (before):** `git status` lists `app.log` and `log/` as untracked files.

```bash
# 4. Create/update .gitignore to exclude both
cat > .gitignore << 'EOF'
*.log
log/
EOF

# 5. Check status again
git status
```

**Expected output (after):** `app.log` and `log/` no longer appear as untracked — only `.gitignore` itself shows up as a new/untracked file, since it's the only thing that actually needs committing.

```bash
# 6. Stage and commit the .gitignore change
git add .gitignore
git commit -m "Add .gitignore to exclude log files and log folder"

# 7. Confirm the working directory is clean
git status
```

**Expected output:** `nothing to commit, working tree clean` — `app.log` and `log/debug.log` still physically exist on disk but Git no longer tracks or reports them.

## Deliverable in this folder

- `.gitignore` — the ignore rules created in this lab.
- `app.log`, `log/debug.log` — sample files that `.gitignore` is configured to exclude (included here just so the pattern is visible; in a real repo these would never actually be committed).
- `terminal-output.txt` — real captured output of every command above, including `git status` before and after adding `.gitignore`, proving `app.log` and `log/` drop out of the untracked-files list.
