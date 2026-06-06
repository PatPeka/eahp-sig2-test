# SIG 2 Agenda Builder

The Agenda Builder is a static browser tool for preparing, reviewing, importing, and exporting content for future EAHP SIG 2 meeting decks. It has no backend and does not write to GitHub.

## Open Locally

Open `tools/agenda-builder/index.html` in Chrome. The builder works directly from the local files and does not require installation, a development server, or an internet connection.

## Open with GitHub Pages

When GitHub Pages is enabled for the repository, open:

`https://patpeka.github.io/eahp-sig2-test/tools/agenda-builder/`

## Build an Agenda

1. Edit the meeting number, title, subtitle, date, storage key, footer label, and objectives.
2. Add, duplicate, delete, or reorder slides.
3. Choose each slide type and edit its title, description, bullets, and optional image reference.
4. Edit use cases, process steps, decisions, grouped questions, and next actions.
5. Select **Preview** on a slide or click a slide in the live agenda list to inspect it.

The builder autosaves the current draft in browser `localStorage`. You can also use **Save draft locally**, **Load local draft**, or **Clear local draft**.

## Images

Upload images to the repository first, ideally under:

`assets/images/`

Then enter the appropriate relative path in the slide or use case image field, for example:

`../../assets/images/workflow-example.png`

This version stores image references as text. It does not upload images or support drag-and-drop.

## Import Existing Content

Paste the contents of an existing `agenda-data.js` or `agenda-data.json` file into the import area and select **Load pasted data**. This can be used to reuse Call #1 or a draft for a future call.

## Export

- **Export agenda-data.js** downloads a JavaScript file beginning with `window.agendaData = { ... };`.
- **Export agenda-data.json** downloads the same data as JSON.
- **Copy agenda-data.js** copies the JavaScript version to the clipboard when browser permissions allow it.

The exported structure is compatible with `templates/meeting-deck/`. Richer fields such as use case status, descriptions, validation focus, decision status, action owners, and image paths are preserved in the data even when the current deck renderer does not display every field.

## Create a New Call with Codex

After exporting, ask Codex to:

1. copy `templates/meeting-deck/` to the new `01-meetings/call-XX/` folder;
2. replace that folder's `agenda-data.js` with the exported file;
3. verify logo paths, navigation, notes, screen-sharing layout, and print output;
4. add the new call to the root landing page.

## Current Limitation

The Agenda Builder does not write files back to GitHub. Download or copy the exported data, then provide it to Codex or commit it through another workflow.
