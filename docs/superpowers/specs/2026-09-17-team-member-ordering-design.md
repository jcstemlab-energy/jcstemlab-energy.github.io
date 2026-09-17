# Team Member Ordering Design

## Scope

Update only the ordering and one cohort label in `data/team-members.json`:

- Reorder the `Postdoctoral Researchers` members to the exact user-provided sequence.
- Change Mr. HUANG, Zuliang from `PhD Student @ 25 Fall` to `PhD Student @ 25 Spring`.
- Reorder `Current PhD Students` by entry cohort from earliest to latest, then alphabetically by English surname within the same cohort.

No member profile content, avatar, or website layout will otherwise change.

## Postdoctoral Researchers Order

1. Dr. JIA, Yubin
2. Dr. ZHANG, Zhijun
3. Dr. HUANG, Sunhua
4. Dr. CHENG, Yuheng
5. Dr. LIN, Zhihao
6. Dr. PAN, Chunyang
7. Dr. ZHENG, Zuqing
8. Dr. WANG, Tianjing
9. Dr. WONG, Yuk Sum

The supplied variants `Huang Sunhua` and `PAN. Chunyang` are mapped to the site's canonical names `Dr. HUANG, Sunhua` and `Dr. PAN, Chunyang`.

## Current PhD Students Order

1. Ms. LI, Tong — 24 Fall
2. Mr. HUANG, Zuliang — 25 Spring
3. Mr. WANG, Haosheng — 25 Fall
4. Mr. ZHANG, Yuchi — 25 Fall
5. Mr. ZHOU, Yujie — 25 Fall
6. Mr. DUAN, Juntao — 26 Spring
7. Mr. HU, Jiaxiang — 26 Spring
8. Mr. HE, Yuzhe — 26 Summer
9. Mr. WANG, Bo — 26 Summer
10. Ms. BAI, Jiayi — 26 Fall
11. Ms. TAO, Yiying — 26 Fall

## Implementation and Validation

1. Add a regression test that asserts the exact postdoctoral order, Mr. HUANG's corrected cohort, and the exact PhD-student order.
2. Run the new test first and confirm it fails against the current data.
3. Reorder the existing JSON member objects without changing their other fields.
4. Validate the JSON and run the complete test suite.
5. Review the Git diff and commit only the intended data and test files.
6. Push to `origin/main` and verify the published data when available.
