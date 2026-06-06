# EAHP SIG 2 Working Decks

This repository contains an offline, dependency-free prototype for EAHP SIG 2 meeting support. The root `index.html` is the GitHub Pages landing page, implemented meeting decks live under `01-meetings/`, and the reusable source template lives under `templates/meeting-deck/`.

## Current Decks

- [Call #1](01-meetings/call-01/): interoperability in hospital pharmacy automation, patient-specific dispense orders, and unit-dose labeling.
- Call #2: coming soon.

## Create a New Meeting Deck

To create Call #2, Codex should:

1. Copy `templates/meeting-deck/` into `01-meetings/call-02/`.
2. Update only `01-meetings/call-02/agenda-data.js` with the Call #2 meeting content.
3. Set a unique `meeting.storageKey`, such as `eahp-sig2-call-02-notes`.
4. Keep the copied `index.html`, `styles.css`, and `app.js` unchanged unless a layout change is explicitly requested.
5. Preserve the logo references to `../../assets/logos/peka-logo.png` and `../../assets/logos/eahp-logo.png`.
6. Add a Call #2 link to the root `index.html` landing page.
7. Verify navigation, notes, logos, full-screen presentation, and print behavior through GitHub Pages.

All meeting-specific information belongs in `agenda-data.js`: meeting metadata, objectives, slide content, use cases, flow steps, decisions, validation questions, next actions, and optional facilitation notes.

## GitHub Pages

To enable GitHub Pages:

1. Open this repository on GitHub.
2. Go to **Settings** and open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. Wait for the Pages deployment to finish.

The landing page will be available at:

`https://patpeka.github.io/eahp-sig2-test/`

Call #1 remains available at:

`https://patpeka.github.io/eahp-sig2-test/01-meetings/call-01/`
