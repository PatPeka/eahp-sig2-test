# EAHP SIG 2 Call #1 Meeting Deck

This folder contains a static slide-style HTML deck for EAHP SIG 2 Call #1, focused on interoperability in hospital pharmacy automation.

## Files

- `index.html` contains the page shell and loads the local scripts.
- `agenda-data.js` contains the meeting-specific slide content and logo references.
- `styles.css` contains the full-screen presentation styling.
- `app.js` renders the slide deck from `agenda-data.js`, handles navigation, and saves meeting notes locally in the browser.

## Logo Paths

The deck uses the uploaded logo files from the repository assets folder:

- Peka logo: `../../assets/logos/peka-logo.png`
- EAHP logo: `../../assets/logos/eahp-logo.png`

The Peka logo appears in the bottom-left footer area of every slide. The EAHP logo appears in the bottom-right footer area of every slide.

## Meeting Notes

Each slide includes a compact editable **Meeting notes** box in the footer. Notes are saved automatically in the browser using `localStorage`, separately for the agenda overview and each slide.

Notes stay on the same computer and browser where they were entered. They are not written back to the repository and are not shared with other participants. If browser storage is cleared, private browsing is used, or a different browser/device is used, the saved notes may not be available.

## Use as a Slide Deck

Open `index.html` in a browser. The first view is the agenda overview/title slide. Click any topic to jump directly to that slide, or use the navigation controls above the footer.

## Keyboard Shortcuts

- `ArrowRight` or `Space`: next slide
- `ArrowLeft`: previous slide
- `Home`: agenda overview
- `Escape`: agenda overview

When typing in a meeting notes box, keyboard navigation is paused so the arrow keys and spacebar can be used for editing text.

## Present in Google Meet

Open the deck in your browser, enter full-screen mode if desired, then share that browser tab or window in Google Meet. Use the on-screen arrows or keyboard shortcuts to move through the slides during the call.

## Print or Save as PDF

Open the browser print dialog and choose **Save as PDF**. The deck switches to print mode so the overview and all eight slides are included. Use landscape orientation for the best slide layout. Browser print settings vary, but disabling headers and footers usually gives the cleanest PDF.

Once GitHub Pages is enabled for the repository, the deck can also be viewed online at:

`https://patpeka.github.io/eahp-sig2-test/01-meetings/call-01/`
