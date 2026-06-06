# SIG 2 Meeting Deck Template

This folder is the reusable source template for EAHP SIG 2 meeting decks. It contains the stable slide layout, navigation, footer logos, meeting notes, print behavior, and rendering logic.

## Create a New Call

For Call #2:

1. Copy the complete `templates/meeting-deck/` folder to `01-meetings/call-02/`.
2. Update only `01-meetings/call-02/agenda-data.js` with the Call #2 title, metadata, objectives, agenda topics, slide content, questions, decisions, and actions.
3. Give the meeting a unique `meeting.storageKey`, such as `eahp-sig2-call-02-notes`, so browser notes remain separate from other calls.
4. Keep `index.html`, `styles.css`, and `app.js` unchanged unless a template evolution is explicitly requested.
5. Add the new call to the root `index.html` landing page.
6. Verify the new folder through GitHub Pages.

## Agenda Data

All meeting-specific content belongs in `agenda-data.js`, including:

- title, subtitle, meeting number, date, and metadata;
- meeting objectives;
- slide titles, leads, bullets, and optional facilitation notes;
- use case cards;
- process flow steps;
- proposed decisions;
- pharmacist, vendor, and FHIR/data model questions;
- next actions;
- the unique browser-storage key for meeting notes.

Supported slide layouts are `use-cases`, `process-flow`, `decisions`, `questions`, and `next-actions`. A slide with a `bullets` array uses the standard bullet layout.

## Logo Paths

Both this template and meeting folders under `01-meetings/` are two directory levels below the repository root, so they use:

- `../../assets/logos/peka-logo.png`
- `../../assets/logos/eahp-logo.png`

Keep the Peka logo on the left and the EAHP logo on the right.

## Notes and Navigation

Each slide has a notes box saved locally in the browser with `localStorage`. Notes are stored per slide and per meeting storage key. They are not committed or shared.

Keyboard controls:

- `ArrowRight` or `Space`: next slide
- `ArrowLeft`: previous slide
- `Home` or `Escape`: agenda overview

Keyboard navigation pauses while a notes field is active.

## Quality Check

Before publishing a new call, verify the overview links, arrows, keyboard navigation, counter, footer logos, editable notes, full-screen layout, and print/save-as-PDF output. The template must remain offline and dependency-free.
