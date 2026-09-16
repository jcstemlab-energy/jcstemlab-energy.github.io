# Square Postdoctoral Avatars Design

## Scope

Replace the website portraits for Dr. CHENG, Yuheng and Dr. PAN, Chunyang with square versions derived from the two user-supplied images. No member data, renderer logic, or unrelated asset will change.

## Crop Strategy

- Treat the first supplied image as Dr. CHENG's portrait and the second as Dr. PAN's portrait.
- Use the full source width as the square edge length.
- Crop only the excess pixels from the bottom, starting each square at the source image's top-left corner.
- This preserves the existing horizontal centering and leaves the original headroom intact instead of cutting the top of either head.
- Preserve the source pixels and identity exactly: no generative editing, retouching, face modification, background replacement, or upscaling.

Expected outputs:

- Dr. CHENG: 114 x 114 pixels, saved over `data/people/chengyuheng.jpg`.
- Dr. PAN: 153 x 153 pixels, saved over `data/people/panchunyang.jpg`.

The supplied PNG crops will be encoded as high-quality JPEG files because the existing member records already reference `.jpg` paths. Existing repository portraits will be backed up outside the repository before replacement.

## Validation

- Confirm both source files are readable and match the expected portrait assignment.
- Confirm both outputs have a 1:1 aspect ratio and the expected dimensions.
- Visually inspect both outputs for horizontal centering and intact headroom.
- Confirm each output differs from the prior repository portrait and corresponds to its supplied source.
- Run the full Node test suite and `git diff --check`.
- Stage only the two avatar files, commit, push to `origin/main`, then compare local and GitHub Pages SHA-256 hashes with bounded retries.

## Safety and Failure Handling

- Stop if `git pull --ff-only origin main` reports divergent history.
- Preserve the existing portraits in a temporary backup directory until validation completes.
- Do not publish if either square crop cuts the head, fails to decode, or has incorrect dimensions.
- Never force-push or include unrelated changes.
