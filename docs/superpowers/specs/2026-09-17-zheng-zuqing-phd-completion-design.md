# Zheng Zuqing PhD Completion Update Design

## Scope

Update Dr. ZHENG, Zuqing's profile to show that his PhD at Central South University was completed in 2026 and that he joined City University of Hong Kong as a Postdoctoral Fellow in 2026. No other member data will change.

## Data Changes

- Change the PhD education year from `2022-Now` to `2022 - 2026`.
- Replace the outdated biography statements that describe him as a current PhD student and CityU Research Assistant.
- State that he received his PhD in Control Science and Engineering from Central South University in 2026.
- State that he joined the Department of Electrical Engineering at City University of Hong Kong as a Postdoctoral Fellow in 2026.
- Preserve the existing bachelor's and master's background and research-interest description.

The revised biography will read:

> Dr. Zuqing Zheng received his B.S. degree in Electrical Engineering and Automation from Hubei Normal University, Hubei, China, in 2018, and his M.E. degree in Signal and Information Processing from the School of Electronic and Information Engineering, Southwest University, Chongqing, China. He received his Ph.D. degree in Control Science and Engineering from the School of Automation, Central South University, in 2026. In 2026, he joined the Department of Electrical Engineering at City University of Hong Kong as a Postdoctoral Fellow. His research interests focus on microgrid modeling, energy management, distributed optimization, and game-theoretic approaches in power systems.

## Validation

Extend the existing Dr. ZHENG test before changing production data. The test will first fail against the old year and biography, then verify:

- The PhD education entry is exactly `2022 - 2026`.
- The biography states PhD completion in 2026.
- The biography states that he joined CityU as a Postdoctoral Fellow in 2026.
- The outdated phrases `currently pursuing a Ph.D.` and `Research Assistant` are absent.

After implementation, validate `data/team-members.json`, run the full Node test suite and `git diff --check`, commit only the JSON and test changes, push to `origin/main`, and perform bounded GitHub Pages verification.

## Safety

- Stop if the required fast-forward pull reports divergent history.
- Preserve unrelated work and never force-push.
- Stop if staged changes contain unexpected files or deletions.
