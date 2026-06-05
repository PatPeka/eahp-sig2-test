window.agendaData = {
  meeting: {
    eyebrow: "EAHP SIG 2",
    title: "Interoperability in Hospital Pharmacy Automation",
    subtitle: "Call #1: patient-specific dispense orders, unit-dose labeling, and validation questions for pharmacists and vendors.",
    meta: ["Call #1", "60 minutes", "Slide deck", "Offline"],
    logos: [
      {
        src: "../../assets/logos/peka-logo.png",
        alt: "Peka logo"
      },
      {
        src: "../../assets/logos/eahp-logo.png",
        alt: "EAHP logo"
      }
    ]
  },
  overviewTitle: "Agenda overview",
  slides: [
    {
      title: "Welcome and SIG 2 objectives",
      kicker: "Slide 1",
      lead: "Set the working frame for SIG 2: practical interoperability guidance for hospital pharmacy automation.",
      bullets: [
        "Confirm the scope for patient-specific dispense orders and unit-dose labeling.",
        "Agree how use cases will be documented and validated.",
        "Separate pharmacist, vendor, and FHIR/data model questions from the start."
      ]
    },
    {
      title: "Reminder of SIG 1 outcomes",
      kicker: "Slide 2",
      lead: "SIG 2 builds on the earlier work by turning shared outcomes into practical workflow and interface guidance.",
      bullets: [
        "Carry forward the clinical and operational priorities identified in SIG 1.",
        "Focus on the handoff between pharmacy information systems and automation systems.",
        "Use SIG 1 gaps to shape the first validation questions."
      ]
    },
    {
      title: "SIG 2 scope: patient-specific dispense order and unit-dose labeling",
      kicker: "Slide 3",
      lead: "The core boundary is the path from validated prescription to prepared, traceable unit dose.",
      bullets: [
        "Patient-specific dispense order created in the pharmacy information system.",
        "Order transmitted to a preparation or automation system.",
        "Unit-dose preparation, labeling, traceability, and status feedback handled consistently."
      ]
    },
    {
      title: "Candidate use cases",
      kicker: "Slide 4",
      lead: "Use these four scenarios to test whether the documentation method is concrete enough for pharmacists and vendors.",
      layout: "use-cases"
    },
    {
      title: "Documentation method: SOP + flow diagram/BPMN",
      kicker: "Slide 5",
      lead: "Document the workflow in a way that is readable first, then formal where useful.",
      bullets: [
        "Start each selected use case with a standard SOP template.",
        "Add a flow diagram before introducing BPMN.",
        "Use BPMN only where the process needs more formal modeling."
      ],
      layout: "process-flow"
    },
    {
      title: "Decisions expected today",
      kicker: "Slide 6",
      lead: "Confirm the working decisions needed to move from discussion to documented use cases.",
      layout: "decisions"
    },
    {
      title: "Open questions for pharmacists and vendors",
      kicker: "Slide 7",
      lead: "Keep clinical workflow, vendor capability, and data-model questions distinct so validation stays clear.",
      layout: "questions"
    },
    {
      title: "Next actions",
      kicker: "Slide 8",
      lead: "Leave the call with owners, inputs, and a concrete preparation path for Call #2.",
      layout: "next-actions"
    }
  ],
  useCases: [
    {
      id: "UC-01",
      title: "Patient-specific dispense order from PIS to preparation system"
    },
    {
      id: "UC-02",
      title: "Unit-dose labeling and traceability"
    },
    {
      id: "UC-03",
      title: "Order cancellation or modification after production planning"
    },
    {
      id: "UC-04",
      title: "Preparation confirmation and status feedback"
    }
  ],
  processFlow: [
    "Prescription validated",
    "Dispense order created",
    "Order transmitted",
    "Preparation system accepts/rejects",
    "Unit dose prepared",
    "Confirmation returned"
  ],
  proposedDecisions: [
    {
      id: "D-001",
      text: "Use case documentation will follow a standard SOP template."
    },
    {
      id: "D-002",
      text: "Each selected use case will include a flow diagram first, then BPMN where appropriate."
    },
    {
      id: "D-003",
      text: "Each use case will maintain separate pharmacist and vendor validation questions."
    }
  ],
  questions: {
    pharmacist: [
      "Which clinical checks must happen before an order is sent?",
      "Which label data are mandatory for safe administration?",
      "Which status changes must be visible in the PIS?"
    ],
    vendor: [
      "Which message formats and identifiers are currently supported?",
      "How are rejected, cancelled, or modified orders handled?",
      "Which confirmation events can be returned automatically?"
    ],
    fhir: [
      "Which FHIR resources best represent the dispense order, preparation task, and status feedback?",
      "Which identifiers must remain stable across PIS, preparation system, label, and traceability records?",
      "Which data fields are mandatory for safe unit-dose labeling and which are implementation-specific?"
    ]
  },
  nextActions: [
    "Confirm owners for the first use case drafts.",
    "Collect pharmacist validation questions for UC-01 and UC-02.",
    "Collect vendor capability questions for order changes and preparation feedback.",
    "Prepare the SOP template and first flow diagram for review before Call #2."
  ]
};
