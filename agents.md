# agents.md

Guidelines for AI agents (and collaborators) working on this repository.

## Repository

- **Remote:** `origin` → `https://github.com/jcstemlab-energy/jcstemlab-energy.github.io.git`
- **Default branch:** `main`
- This is the JC Stem Lab (Energy) public website, published via GitHub Pages.
- Working convention (set 2026-07-31): **always pull from remote before making changes, and commit + push automatically after changes.**

## Git workflow (required)

### 1. Pull before any change

Always sync with the remote first:

```bash
git pull --ff-only origin main
```

- If the pull is **not** a fast-forward (history has diverged), **STOP and ask the user**.
- Do not auto-rebase, merge, or force anything when histories diverge.

### 2. Make the change, then commit and push automatically

```bash
git add <changed files>      # prefer explicit paths over `git add -A`
git commit -m "<clear, descriptive message>"
git push origin main
```

The push should happen automatically after a successful change — this is the expected behavior, not an exception.

### 3. Safety guards (never skip)

- **Never force-push.** No `--force` / `-f`, ever.
- **Never push mass deletions.** Before committing, inspect `git status`. If the staged change set contains deletions of files that still exist on disk, **STOP** — do **not** run `git add -A` and push. Resolve the index state first (e.g. `git restore --staged .` to unstage without touching disk files).
- Only commit the files you actually intended to change.
- **Known repo hazard:** this repo has, at times, entered a state where all files are staged as deleted while still present on disk (leftover from a `git rm --cached .`). Treat any large batch of "D" entries in `git status` as a red flag and verify before pushing.

## Data conventions

- **Team member data:** `data/team-members.json`
  - Schema: `categories[] → subcategories[] → members[]`.
  - Member fields: `id`, `title`, `role[]` (first entry is the highlighted cohort tag, e.g. `PhD Student @ 26 Summer`; subsequent entries are dept/background, not highlighted), `avatar`, `socialLinks[]`, `interests[]`, `biography`, `education[]` (most-recent first), `last_name`.
  - Title convention: `Mr. / Ms. / Prof. LAST, First`.
- **Avatars:** place image files in `data/people/`, referenced as `data/people/<filename>.jpg`.
- **Validation:** always validate JSON (`python -m json.tool data/team-members.json`) before committing.
- **Typo hygiene:** normalize obvious typos on ingest (e.g. `Phd` → `PhD`, `Industril` → `Industrial`) and flag the change to the user.
