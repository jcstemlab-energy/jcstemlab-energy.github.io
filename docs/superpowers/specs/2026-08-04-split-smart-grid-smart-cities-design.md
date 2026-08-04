# Split Smart Grid and Smart Cities Research Thrusts

## Goal

Split the existing combined “Smart grid and smart cities” research thrust into two independent topics while keeping the website content internally consistent and preserving the current visual design.

## Scope

- Replace the combined research entry with separate `Smart grid` and `Smart cities` entries.
- Give each entry its own icon and description.
- Update the About section from three numbered research areas to four.
- Keep the existing responsive grid and card styling unchanged.

## Content Design

### Smart grid

- Focus: intelligent and resilient electricity networks, grid modernization, and efficient resource coordination.
- Icon: the Font Awesome `fas fa-bolt` icon.
- Description: “Developing intelligent and resilient power grids through advanced monitoring, control, and efficient coordination of energy resources.”

### Smart cities

- Focus: sustainable urban energy systems and coordination across city infrastructure.
- Icon: the existing Font Awesome `fas fa-city` icon.
- Description: “Advancing sustainable smart cities through integrated urban energy systems, infrastructure coordination, and efficient resource allocation.”

## Files and Data Flow

- `data/research.json` remains the source of research-card titles and ordering.
- `index.html` continues to map each title to its Font Awesome icon and descriptive copy.
- The About paragraph in `index.html` lists the same four research thrusts in the same order as the JSON data.
- Existing JavaScript renders one card per JSON entry; no rendering or CSS refactor is required.

## Validation

- Add a lightweight automated content test that verifies:
  - `Smart grid` and `Smart cities` both exist in `data/research.json`.
  - The old combined key no longer exists.
  - The icon and description maps contain both new titles.
  - The About paragraph contains all four numbered research areas.
- Run the test first and confirm it fails because the split is not yet implemented.
- Implement the minimal content changes and confirm the test passes.
- Reload the local preview and verify four cards render without browser console errors.

## Out of Scope

- Redesigning the Research Thrusts section.
- Moving icon and description metadata into JSON.
- Changing unrelated research content, navigation, or page styling.
