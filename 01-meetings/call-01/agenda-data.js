window.agendaData = {
  meeting: {
    eyebrow: "EAHP SIG 2",
    title: "Interoperability in Hospital Pharmacy Automation",
    subtitle: "Call #1 focuses on patient-specific dispense orders, unit-dose labeling, and how pharmacists and vendors will validate the first use cases.",
    meta: ["Call #1", "60 minutes", "Offline static agenda"],
    notesPlaceholder: "Capture decisions, owners, open questions, and validation follow-ups here."
  },
  objectives: [
    "Confirm the SIG 2 scope for patient-specific dispense orders and unit-dose labeling.",
    "Select the first interoperability use cases to document.",
    "Agree the documentation method: SOP first, flow diagram next, BPMN where appropriate.",
    "Separate pharmacist, vendor, and FHIR/data model validation questions."
  ],
  agendaSections: [
    {
      title: "Welcome and SIG 2 objectives",
      duration: "5 min",
      description: "Confirm the group objective: define practical interoperability guidance for hospital pharmacy automation."
    },
    {
      title: "Reminder of SIG 1 outcomes",
      duration: "5 min",
      description: "Briefly connect SIG 2 work to the earlier outcomes and unresolved items from SIG 1."
    },
    {
      title: "SIG 2 scope: patient-specific dispense order and unit-dose labeling",
      duration: "10 min",
      description: "Align on the automation boundary from validated prescription through preparation, labeling, and status feedback."
    },
    {
      title: "Candidate use cases",
      duration: "12 min",
      description: "Review the four candidate use cases and decide which need deeper documentation first."
    },
    {
      title: "Documentation method: SOP + flow diagram/BPMN",
      duration: "8 min",
      description: "Agree how each use case will be documented before clinical and vendor validation."
    },
    {
      title: "Decisions expected today",
      duration: "8 min",
      description: "Confirm the documentation approach, decision log, and validation structure."
    },
    {
      title: "Open questions for pharmacists and vendors",
      duration: "8 min",
      description: "Separate clinical workflow questions from technical integration and vendor capability questions."
    },
    {
      title: "Next actions",
      duration: "4 min",
      description: "Assign owners, confirm timelines, and prepare input for the next SIG 2 call."
    }
  ],
  useCases: [
    {
      id: "UC-01",
      title: "Patient-specific dispense order from PIS to preparation system",
      description: "Define the minimum information needed to transmit a validated patient-specific dispense order from the pharmacy information system."
    },
    {
      id: "UC-02",
      title: "Unit-dose labeling and traceability",
      description: "Clarify label data, identifiers, batch references, and traceability requirements for prepared unit doses."
    },
    {
      id: "UC-03",
      title: "Order cancellation or modification after production planning",
      description: "Describe how late clinical or operational changes should be communicated after preparation work has been scheduled."
    },
    {
      id: "UC-04",
      title: "Preparation confirmation and status feedback",
      description: "Define the status messages returned to the PIS after acceptance, rejection, preparation, or completion."
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
  pharmacistValidationQuestions: [
    "Which clinical checks must happen before an order is sent?",
    "Which label data are mandatory for safe administration?",
    "Which status changes must be visible in the PIS?"
  ],
  vendorValidationQuestions: [
    "Which message formats and identifiers are currently supported?",
    "How are rejected, cancelled, or modified orders handled?",
    "Which confirmation events can be returned automatically?"
  ],
  fhirDataModelQuestions: [
    "Which FHIR resources best represent the dispense order, preparation task, and status feedback?",
    "Which identifiers must remain stable across PIS, preparation system, label, and traceability records?",
    "Which data fields are mandatory for safe unit-dose labeling and which are implementation-specific?"
  ],
  nextActions: [
    "Confirm owners for the first use case drafts.",
    "Collect pharmacist validation questions for UC-01 and UC-02.",
    "Collect vendor capability questions for order changes and preparation feedback.",
    "Prepare the SOP template and first flow diagram for review before Call #2."
  ]
};
