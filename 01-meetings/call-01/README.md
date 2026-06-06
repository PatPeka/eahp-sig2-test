# EAHP SIG 2 Call #1 Meeting Deck

This folder is the implemented Call #1 instance of the reusable template in `templates/meeting-deck/`. Its meeting-specific content is stored in the local `agenda-data.js`; the page shell, styles, and renderer follow the stable template.

## Files

- `index.html` contains the page shell and loads the local files.
- `agenda-data.js` contains all Call #1 content and metadata.
- `styles.css` contains the full-screen presentation styling.
- `app.js` renders the deck, handles navigation, and saves meeting notes locally.

Future content changes for Call #1 should normally be made only in `agenda-data.js`. Template layout changes should be made only when explicitly requested and then considered for `templates/meeting-deck/` as well.

## Logo Paths

- Peka logo: `../../assets/logos/peka-logo.png`
- EAHP logo: `../../assets/logos/eahp-logo.png`

The Peka logo appears bottom-left and the EAHP logo bottom-right on every slide.

## Meeting Notes

Each slide and the overview include an editable **Meeting notes** box. Notes save automatically in the browser using `localStorage` under the Call #1 storage key. They remain on that browser/device, are not committed to the repository, and may disappear if browser storage is cleared or private browsing is used.

## Use as a Slide Deck

Open `index.html` locally or use the GitHub Pages URL. Click any overview topic to jump to its slide, or use the controls above the footer.

Keyboard shortcuts:

- `ArrowRight` or `Space`: next slide
- `ArrowLeft`: previous slide
- `Home` or `Escape`: agenda overview

Keyboard navigation pauses while typing in meeting notes.

## Google Meet and PDF

For Google Meet, open the deck in a browser, enter full-screen mode if desired, and share the browser tab or window.

To save a PDF, open the browser print dialog, choose **Save as PDF**, use landscape orientation, and disable browser headers and footers where available. Print mode includes the overview and all eight slides.

Online URL:

`https://patpeka.github.io/eahp-sig2-test/01-meetings/call-01/`
