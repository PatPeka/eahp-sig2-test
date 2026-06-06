# SIG 2 Meeting Deck Instructions

Use `templates/meeting-deck/` as the reusable source template for EAHP SIG 2 meeting decks.

## Repository Pattern

- Create one folder per meeting under `01-meetings/call-XX/`.
- Start a new meeting by copying the complete `templates/meeting-deck/` folder.
- Keep all meeting-specific content in the copied `agenda-data.js`.
- Give every meeting a unique `meeting.storageKey` for locally saved notes.
- Update the root `index.html` landing page whenever a new call is added.

## Template Stability

- Do not edit the template layout, styles, or rendering logic unless the user explicitly asks for a template evolution.
- Do not put meeting-specific titles, agenda text, decisions, questions, or actions in `index.html`, `styles.css`, or `app.js`.
- Preserve offline operation and avoid external dependencies, package installation, React, and external libraries.
- Preserve the full-screen slide format, agenda overview hero, navigation arrows, keyboard navigation, slide counter, print behavior, and screen-sharing readability.

## Footer and Notes

- Preserve the Peka logo in the bottom-left footer and the EAHP logo in the bottom-right footer.
- Use the repository logos from `assets/logos/` with paths appropriate to the meeting folder. For folders at `templates/meeting-deck/` and `01-meetings/call-XX/`, use:
  - `../../assets/logos/peka-logo.png`
  - `../../assets/logos/eahp-logo.png`
- Preserve the editable meeting notes box and browser `localStorage` behavior.

## Verification

For every new or changed deck, verify the overview links, previous/next controls, keyboard shortcuts, slide counter, footer logos, editable notes, full-screen layout, and print/save-as-PDF output. Confirm the final GitHub Pages URL works.
