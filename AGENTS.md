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

## Updating team member information

Team member data lives in **`data/team-members.json`**. When the user supplies new/updated member info (often a tab-separated paste from a spreadsheet, **one person per column**), follow these rules.

### 1. Where to put the member (subcategory)

Pick the `subcategories[].members[]` array that matches their role:

| Subcategory | Who |
|---|---|
| `Lab Director` | Department head (e.g. Prof. Dong) |
| `Faculty` | Professors — Assistant / Associate / Research Assistant Professor |
| `Postdoctoral Researchers` | Postdocs (`postdoc-...`) |
| `Current PhD Students` | PhD students — cohort tag like `PhD Student @ 26 Summer` |
| `Research Assistant` | RAs (`ra...`) |

### 2. ID convention (`id` field)

- Faculty: `faculty-<lastname>` (e.g. `faculty-hlli`)
- PhD: `phd<2-digit year>-<lastname>` — year from the cohort (e.g. `phd26-wangbo`)
- Postdoc: `postdoc-<firstname>-<lastname>`
- RA: `ra<2-digit year>-<lastname>`
- Keep IDs unique and lowercase, no spaces.

### 3. Field mapping (spreadsheet column → JSON)

| Source (typical row) | JSON target |
|---|---|
| Name (e.g. `Mr. WANG, Bo`) | `title` — keep site convention `Mr./Ms./Prof. LAST, First`. If given in Western order (`Yuzhe He`), convert and **flag to user**. |
| `PhD Student` (category label) | Usually redundant — do not add to `role`. |
| Cohort tag (`PhD Student @ 26 Summer`) | `role[0]` with `highlighted: true` |
| Department / background line(s) | `role[1..]` with `highlighted: false` |
| Email | `socialLinks` → `type: "envelope"`, `url: "mailto:..."` |
| Google Scholar URL | `socialLinks` → `type: "google-scholar"`, `icon: "fas fa-graduation-cap"` |
| GitHub URL | `socialLinks` → `type: "github"`, `icon: "fab fa-github"` |
| Homepage URL | `socialLinks` → `type: "home"`, `icon: "fas fa-home"` |
| Interests (`a; b; c`) | `interests[]` — split on `;` into separate strings |
| Education rows (degree / institution / year, repeated) | `education[]`, **most-recent first**, each `{degree, institution, year}` |
| Biography (may span several rows, often quoted) | `biography` — single string; use `\n` for paragraph breaks |

### 4. `role` array shape

```json
"role": [
  { "text": "PhD Student @ 26 Summer", "highlighted": true },
  { "text": "Department of Electrical Engineering, City University of Hong Kong", "highlighted": false }
]
```

- First entry = the highlighted cohort/position tag.
- Following entries = department or prior-degree background, **not** highlighted.

### 5. `socialLinks` shape

```json
{ "type": "envelope", "url": "mailto:name@cityu.edu.hk", "icon": "fas fa-envelope", "title": "Email" }
```

Valid `type`s observed: `envelope`, `google-scholar`, `github`, `home`, `other`.

### 6. Avatars

- Store images in `data/people/`, reference as `data/people/<filename>.jpg` (match the extension already used for that person if they exist).
- **If no image is supplied:** still write the `avatar` path (placeholder), commit, and **explicitly tell the user to add the real image** — otherwise the page shows a broken image. Do not invent or copy an unrelated photo.

### 7. Typo / hygiene rules (fix + flag)

On ingest, normalize obvious errors and tell the user what changed:
- `Phd` → `PhD` (both in role tags and degree names)
- `Industril` → `Industrial`
- Year typos, e.g. `202 - 2006` → `2002 - 2006` (verify against the surrounding timeline)
- Drop stray copy artifacts (e.g. a `‑_` prefix before a URL)
- Split run-on interest lists into clean array items

### 8. Validate before commit

```bash
python -m json.tool data/team-members.json > /dev/null && echo "JSON OK"
```

If it fails, fix the syntax before committing.

### 9. Reference

Full schema and examples: `docs/team-member-info-template.md`.
