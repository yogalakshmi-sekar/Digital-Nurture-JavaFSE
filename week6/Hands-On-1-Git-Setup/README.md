# Hands-On 1 — Git Setup & First Commit

**Objectives:** get comfortable with `git init`, `git status`, `git add`, `git commit`, `git push`, and `git pull`; set up global Git config; make Notepad++ the default Git editor.

**Estimated time:** 30 minutes

## Step 1: Set up Git configuration

```bash
# Confirm Git client is installed
git --version

# Set user-level identity (used in every commit you make)
git config --global user.name "Yogalakshmi Sekar"
git config --global user.email "yourname@example.com"

# Confirm the configuration was saved
git config --list
```

**Expected output:** `git --version` prints something like `git version 2.4x.x.windows.1`. `git config --list` shows `user.name=...` and `user.email=...` among the other settings.

## Step 2: Make Notepad++ the default Git editor

```bash
# Check if Git Bash already recognises notepad++
notepad++
```

If Bash can't find it, Notepad++'s install folder isn't on the PATH yet.

1. Control Panel → System → Advanced system settings → Environment Variables.
2. Under the user `Path` variable, add the Notepad++ install folder (typically `C:\Program Files\Notepad++`).
3. Close and reopen Git Bash.

```bash
# Re-test
notepad++

# Create a permanent alias for launching it as Git's editor
echo "alias notepad++='/c/Program Files/Notepad++/notepad++.exe -multiInst -notabbar -nosession -noPlugin'" >> ~/.bashrc
source ~/.bashrc

# Tell Git to use Notepad++ as the default editor
git config --global core.editor "notepad++.exe -multiInst -notabbar -nosession -noPlugin"

# Verify — the -e flag opens the global config in the configured editor
git config -e
```

**Expected output:** Notepad++ opens showing the full `~/.gitconfig` contents, confirming it's now the default editor.

## Step 3: Add a file to a new repository

```bash
# Create and initialize a new local repo
git init GitDemo
cd GitDemo

# Confirm the hidden .git folder exists
ls -la

# Create a tracked file
echo "Welcome to Git Demo" > welcome.txt
ls -la
cat welcome.txt

# Check working directory status
git status
```

**Expected output:** `git status` shows `welcome.txt` as an **untracked file**.

```bash
# Stage the file
git add welcome.txt

# Commit — this opens Notepad++ for a multi-line commit message
git commit

# Confirm the working directory and local repo now match
git status
```

**Expected output:** After the commit, `git status` reports `nothing to commit, working tree clean` — `welcome.txt` is now part of the local repository history.

## Step 4: Connect to a remote (GitLab/GitHub) repository

> Create a free GitHub/GitLab account first — do **not** use Cognizant credentials.
> Create a remote repository named **GitDemo**, then:

```bash
git remote add origin <your-remote-repo-url>
git pull origin master
git push origin master
```

**Expected output:** `git push` uploads `welcome.txt` and the commit history; refreshing the remote repo page shows the file.

## Deliverable in this folder

- `welcome.txt` — the file created and committed in this lab.
