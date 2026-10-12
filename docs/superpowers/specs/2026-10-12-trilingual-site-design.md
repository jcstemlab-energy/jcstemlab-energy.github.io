# Trilingual Website

The user approved English, Simplified Chinese and Traditional Chinese on 2026-10-12, extending the previously proposed bilingual design.

## Behaviour

- Provide visible Simplified / EN / Traditional buttons on the toolbar of every public page, with an accessible active state and keyboard support.
- Default to English. Persist an explicit choice in local storage; language query parameters also support direct preview links.
- Keep profile IDs, section anchors and research-category parameters when switching. Preserve member ordering, photographs, links and publication metadata.
- Translate existing homepage content, research descriptions, news, team roles, interests, education and member biographies using authored translations bundled with the static site.
- Preserve unconfirmed Chinese personal names and original academic paper titles. Content without an authored translation falls back to its English source.
- Preserve source text for reversible switching, including text injected asynchronously by existing JSON loaders.
- Store English as the existing canonical data. Profile translation fingerprints prevent applying old Chinese biographies to edited English profiles.

## Implementation

- `js/i18n-content.js` contains source / simplified / traditional strings and profile translations keyed by member ID.
- `js/i18n.js` performs reversible text-node and label translation, observes asynchronously loaded content and remembers the selected language.
- `js/i18n.css` styles keyboard-accessible buttons and adapts the navigation toolbar to narrow screens.
- Public HTML pages load the same three assets. Existing loaders and JSON schemas continue to work.

## Verification and Maintenance

Run the repository tests and validate language switching in a browser at desktop and mobile sizes, including refresh, profile navigation, delayed content and return to English. Verify the deployed page after pushing.

When English text changes, update its translation row. For biographies, update both paragraph arrays and the fingerprint calculated by `fingerprint` in `js/i18n.js`. Until updated, changed biographies intentionally show their original English rather than stale translated facts.

Verified locally: all 21 repository tests pass; homepage English text restores exactly after switching; all 26 member biographies and structured profile fields have both Chinese variants. Browser checks cover remembered language, profile navigation, news, team lists, original publication titles, desktop layout, mobile navigation and keyboard activation. Archived seminar abstracts remain in their supplied original language.
