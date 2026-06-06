window.agendaData = {
  meeting: {
    documentTitle: "EAHP SIG 2 Call #X Agenda",
    eyebrow: "EAHP SIG 2",
    title: "Meeting title",
    subtitle: "Short description of the meeting scope and intended outcome.",
    meetingNumber: "Call #X",
    date: "Date to be confirmed",
    meta: ["Call #X", "60 minutes", "Slide deck", "Offline"],
    storageKey: "eahp-sig2-call-xx-notes",
    objectives: [
      "First meeting objective.",
      "Second meeting objective.",
      "Third meeting objective."
    ],
    logos: [
      {
        src: "../../assets/logos/peka-logo.png",
        alt: "Peka logo",
        position: "left"
      },
      {
        src: "../../assets/logos/eahp-logo.png",
        alt: "EAHP logo",
        position: "right"
      }
    ]
  },
  slides: [
    {
      title: "Welcome and meeting objectives",
      kicker: "Slide 1",
      lead: "Set the working frame for this SIG 2 call.",
      bullets: [
        "First meeting objective.",
        "Second meeting objective.",
        "Third meeting objective."
      ],
      facilitationNotes: "Optional speaker or facilitation note. This field is not displayed on the slide."
    },
    {
      title: "Candidate use cases",
      kicker: "Slide 2",
      lead: "Use cards for compact named scenarios.",
      layout: "use-cases",
      items: [
        { id: "UC-01", title: "First use case" },
        { id: "UC-02", title: "Second use case" }
      ]
    },
    {
      title: "Process flow",
      kicker: "Slide 3",
      lead: "Show a concise sequence of workflow steps.",
      layout: "process-flow",
      steps: ["Step one", "Step two", "Step three", "Step four"]
    },
    {
      title: "Decisions expected",
      kicker: "Slide 4",
      lead: "List decisions that should be confirmed during the call.",
      layout: "decisions",
      items: [
        { id: "D-001", text: "First proposed decision." },
        { id: "D-002", text: "Second proposed decision." }
      ]
    },
    {
      title: "Open questions",
      kicker: "Slide 5",
      lead: "Keep validation questions grouped by audience or topic.",
      layout: "questions",
      groups: [
        { title: "Pharmacist validation", items: ["First pharmacist question?"] },
        { title: "Vendor validation", items: ["First vendor question?"] },
        { title: "FHIR / data model", items: ["First data model question?"] }
      ]
    },
    {
      title: "Next actions",
      kicker: "Slide 6",
      lead: "Close with clear owners and follow-up work.",
      layout: "next-actions",
      items: ["First action.", "Second action.", "Third action."]
    }
  ]
};
