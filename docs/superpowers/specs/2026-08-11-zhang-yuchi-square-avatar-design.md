# Zhang Yuchi Square Avatar Design

## Goal

Replace Mr. ZHANG, Yuchi’s portrait with a square version that preserves visible space above his head and is not cropped again by the website’s 1:1 avatar container.

## Source and Output

- Source: the user-supplied 960 × 1440 PNG portrait.
- Output: a 960 × 960 image stored at `data/people/zhangyuchi.jpg`.
- Aspect ratio: exactly 1:1.
- The existing JSON avatar path remains unchanged.

## Composition

- Use the approved balanced composition (option B).
- Use the exact crop rectangle `x=0, y=72, width=960, height=960`.
- Keep approximately 128 pixels of visible background between the top edge and the subject’s hair.
- Keep the face and upper body centered and fully visible.

## Image Integrity

- Preserve the subject’s identity, facial features, expression, clothing, background, lighting, and color.
- Do not retouch, beautify, reconstruct, or add visual content.
- Reframing and format conversion are the only intended image changes.

## Website Integration

- Back up the current `data/people/zhangyuchi.jpg` before replacement.
- Replace that file without changing `data/team-members.json`.
- The website’s `.team-member-card img` already uses a 1:1 aspect ratio with `object-fit: cover`; a square source prevents additional vertical cropping.

## Validation

- Verify the output dimensions are 960 × 960.
- Verify the output file is a valid JPEG.
- Visually confirm that the hair and head-top spacing remain visible.
- Preview the website card and confirm the head is not clipped.
- Confirm Git shows only the intended avatar and design-document changes before committing the implementation.

## Out of Scope

- Changing other team-member images.
- Editing personal information or page styling.
- Retouching or regenerating the portrait.
