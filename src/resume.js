import { skills } from "./skills.js?v=20261102-skills";

// Public, curated facts. Provenance and date decisions: content-notes.md.
export const resume = {
  snapshot: "October 2026",
  highlights: [
    { year: "2026", value: "3 days → <15 min", title: "Kafka as infrastructure as code", text: "Architected production Kafka on GKE with Strimzi, Helm, and Harness CI/CD, replacing manual provisioning with a reviewed, automated deployment pipeline." },
    { year: "2023", value: "~$35k / month", title: "Lower cloud infrastructure cost", text: "Redesigned the Kafka QA platform and benchmarked VM configurations, reducing monthly cost from about $39,000 to $4,000 and cluster installation from hours to five minutes." },
    { year: "2025–2026", value: "2 hours → <2 min", title: "AI-assisted Kafka operations", text: "Built a Kafka MCP server and extended it into Slack-based troubleshooting. Estimated issue data collection and analysis time; not an average measured across incidents." },
    { year: "2026", value: "1 gateway IP", title: "Scalable cloud connectivity", text: "Designed an autoscaling SNI-routing gateway per GKE cluster, replacing per-broker IP exposure while preserving end-to-end mTLS. Designed highly available cluster discovery." },
    { year: "2024–2025", value: "VMs → containers", title: "Modernized Kafka replication", text: "Led the redesign and deployment of MirrorMaker 2 on a Kubernetes-based platform, with secure cross-environment replication, monitoring, and UI-based management." },
    { year: "2026 · BUILT & TESTED", value: "Zero-restart design", title: "Kafka cluster switching", text: "Built and tested client re-bootstrap: producers switched in about 1–2 seconds and consumers in 5–10 seconds with no message loss in three test scenarios. Client rollout had not started in the October summary." },
  ],
  experience: [
    {
      company: "PayPal",
      location: "Chennai, India",
      period: "2021 — 2026 snapshot",
      role: "Staff Software Engineer · Kafka Platform",
      note: "February 2021 – documented through October 2026 · Member of Technical Staff 1, then Member of Technical Staff 2 / Staff Software Engineer",
      summary: "Technical leadership across Kafka architecture, cloud modernization, reliability, and AI-assisted operations.",
      details: [
        "2026: Architected and delivered production Kafka on GKE using Strimzi, Helm, and Harness. Defined clusters, topics, ACLs, and configuration as code, with validation, rollback, and audit trails. Cut provisioning from about three days to under 15 minutes.",
        "2026: Designed and built an autoscaling SNI-routing gateway with one entry IP per GKE cluster and end-to-end mTLS; designed highly available discovery and co-authored a cloud migration strategy accepted by the Cloud Architecture Forum.",
        "2026: Built and tested automatic client re-bootstrap for cluster moves without application restarts. Producer switching took about 1–2 seconds and consumer switching 5–10 seconds in tests, with no message loss in three scenarios. Client rollout remained pending in October 2026.",
        "2025–2026: Designed and deployed the Kafka MCP server, then extended its tools and integrated Slack-based troubleshooting. Built a Slack-triggered agentic AI assistant using LangGraph and Claude, combining MCP tools with retrieval-augmented generation (RAG) to answer queries and support Kafka troubleshooting. Estimated data collection and analysis fell from at least two hours to under two minutes; the 2026 bot handled 10 customer issues and 50+ internal queries.",
        "2024–2025: Led the redesign and deployment of MirrorMaker 2 from VM-based replication to a Kubernetes-based platform; integrated authentication, observability, management UIs, and secure production-to-sandbox mirroring.",
        "2024: Led a phased SASL security rollout with no user impact reported in the review, and completed migration of Kafka observability from SignalFx to Datadog using Micrometer.",
        "2025: Contributed an Apache Kafka performance-testing fix for large payload files (KAFKA-18115, PR #18391), merged into the upstream project in May 2025.",
        "2023: Rebuilt the Kafka QA platform with Terraform, Ansible, Docker, and Puppet. Reduced monthly infrastructure cost from about $39,000 to $4,000 and cluster installation from hours to five minutes, with production-aligned test environments.",
        "2021–2022: Led Kafka infrastructure and disaster-recovery setup for the China payments environment; built partition-aware failover automation, cross-region metadata synchronization, and container-aware patching. Migrated the cluster metadata repository without downtime or data loss.",
        "2025–2026: Automated fleet upgrades and change workflows, mentored engineers, led design reviews and sprint planning, and covered interim team management in 2025. In 2026, planned and groomed 351 stories for five engineers; about 80% were closed at the summary date.",
      ],
      tags: ["Kafka", "GKE", "Platform architecture", "MCP", "Technical leadership"],
      impact: { value: "<15 min", label: "cluster provisioning · 2026" },
    },
    {
      company: "SAP Labs",
      location: "Bangalore, India",
      period: "2012 — 2021",
      role: "Associate Development Architect",
      note: "March 2012 – February 2021",
      summary: "Cloud frameworks, data services, and developer tools.",
      details: [
        "Role progression: Quality Associate – Performance (March 2012–October 2014); Developer (August 2013–October 2014 and November 2014–March 2016); Senior Developer (March 2016–March 2019); Associate Development Architect (March 2019–February 2021).",
        "Worked with a research team in Germany on database-independent Core Data Services (CDS) modeling and exposure through the OData protocol.",
        "Developed a Java annotation-based extension framework that let SAP cloud developers expose HANA databases as OData services with minimal coding.",
        "Built a multi-tenant enterprise backend-as-a-service application using Java, Node.js, and SAP UI5 to provision databases, deploy models, and expose REST services with minimal application code.",
        "Created a framework for end-to-end REST service testing with record and playback support.",
        "Shared knowledge with the developer community through talks and workshops at SAP Tech Hub.",
        "In a performance engineering role, built mobile test apps for Android, iOS, and BlackBerry and used Introscope to capture performance results. Automated tests reduced a two-hour workflow to ten minutes.",
      ],
      tags: ["Java", "OData", "Developer frameworks", "Performance"],
      impact: { value: "2h → 10m", label: "performance test workflow" },
    },
    {
      company: "VSO · SAP Social Sabbatical",
      location: "Uganda",
      period: "2018",
      role: "Solutions Architect",
      note: "October–November 2018 · social sabbatical during SAP employment",
      summary: "Student information management for vocational education.",
      details: ["Worked with three partner educational institutes in Uganda to develop a student information management system, translating operational needs into a working solution during a one-month social sabbatical."],
      tags: ["Solution architecture", "Education", "Social impact"],
    },
    {
      company: "Infosys",
      location: "",
      period: "2011 — 2012",
      role: "Quality Engineer",
      note: "June 2011 – March 2012",
      summary: "A foundation in software quality and banking applications.",
      details: [
        "Wrote comprehensive tests and tested the BIC teller application for Citizens Bank.",
        "Internship (February–October 2011): developed an application to perform SNMP walks on network devices and simulate multiple devices of the same type.",
      ],
      tags: ["Quality engineering", "Application testing"],
    },
  ],
  skills,
  innovations: [
    {
      number: "01",
      category: "CONNECTED DEVICES",
      title: "Everyday objects, new possibilities.",
      description:
        "Explorations with a smart water bottle, a GPS-following drone, and a helmet with navigation, music, and call handling.",
      tags: ["IoT", "Prototyping"],
    },
    {
      number: "02",
      category: "AUTOMATION",
      title: "A home with a little more intelligence.",
      description:
        "Intelligent home automation using Raspberry Pi, alongside talks and workshops to help others start building.",
      tags: ["Raspberry Pi", "Workshops"],
    },
    {
      number: "03",
      category: "EXPERIMENTS",
      title: "Following an idea through.",
      description:
        "Predicting the next request with machine learning, and founding a startup exploring revenue through free Wi-Fi.",
      tags: ["Machine learning", "Entrepreneurship"],
    },
  ],
  recognition: [
    { label: "PAYPAL · 2026", title: "7 peer recognitions", text: "Recognized for cloud migration architecture, incident support, mentoring, security patching, and platform performance. Google Cloud Summit India Terraform track winner, March 2026." },
    { label: "LEADERSHIP · 2025–2026", title: "Architecture and team delivery", text: "Cloud Architecture Forum approvals for Kafka cloud architecture and migration strategy; interim team management in 2025 and technical guidance for five engineers in 2026." },
    {
      label: "RECOGNITION",
      title: "3 Catalyst awards",
      text: "Ranked among the top 5% of SAP employees worldwide for three consecutive years.",
    },
    {
      label: "INNOVATION",
      title: "Building beyond the brief",
      text: "Innovation Week winner in 2014, 2016, and 2018. SAP d-code 2014 Demo Jam finalist for mobile automation using Raspberry Pi.",
    },
    {
      label: "CONTRIBUTION",
      title: "Technology with a purpose",
      text: "One of 12 people selected globally at SAP Labs for a CSR program in Hoima, Uganda. Built a student-data analysis system in one month for three educational institutes.",
    },
    {
      label: "COLLABORATION",
      title: "Ideas become shared work",
      text: "Worked with the MD of SAP Labs India on an internal crowdsourcing platform connecting developers with idea owners. Received a company-sponsored fellowship in Palo Alto.",
    },
  ],
  education: [
    {
      degree: "Executive Certification · Advanced Data Science and Applications",
      school: "IITM Pravartak Technologies Foundation",
      year: "Issued January 2025",
      project: "Advanced data science and artificial intelligence applications.",
    },
    {
      degree: "M.Tech · Software Systems",
      school: "Birla Institute of Technology, Pilani",
      year: "2015–2017",
      project:
        "Designed a specification to represent MongoDB as an OData service, with an implementation demonstrated in Java.",
    },
    {
      degree: "B.Tech · Computer Science",
      school: "Amrita University, Coimbatore",
      year: "2011",
      project:
        "Built a video-mining tool that extracts frames, recognizes text with OCR, and tags videos to make their contents searchable.",
    },
  ],
};

// Repositories with minimal READMEs are deliberately described without inferred features.
export const projects = [
  { title: "Slack-triggered agentic AI assistant", category: "PAYPAL · AGENTIC AI", description: "Built an agentic AI project triggered from Slack, using LangGraph and Claude with MCP tools and retrieval-augmented generation (RAG) to answer queries and support Kafka troubleshooting.", links: [] },
  { title: "Following drone", category: "ROBOTICS · PROTOTYPE", description: "Programmed a Drone 2.0 prototype to receive GPS coordinates from a mobile phone and follow its user.", links: [] },
  { title: "Poke Android app", category: "ANDROID · PROJECT ARCHIVE", description: "An earlier Android app experiment, archived with its source repository.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/Poke-App" }] },
  { title: "Context sharing app", category: "ANDROID · PROTOTYPE", description: "Android prototype that shares activity and availability states such as running, sleeping, driving, meetings, silent mode, and do-not-disturb to help callers understand availability. Includes manual status updates.", links: [] },
  { title: "Smart Health Index", category: "CONNECTED DEVICES · PROTOTYPE", description: "Prototype that combines everyday activity and sensor inputs, including sleep, steps, heart rate, and smoking detection, into a health index out of ten. Smart Health Index and Smart Bottle placed second in SAP's IoT Chef hackathon in 2015.", links: [] },
  { title: "SAP food-menu app", category: "ANDROID · PROJECT ARCHIVE", description: "Android app that checked for updates and displayed the daily SAP company food menu, first listed in June 2014.", links: [] },
  { title: "Mobile-controlled car", category: "RASPBERRY PI · PROTOTYPE", description: "Node.js and GPIO prototype for remotely controlling a Raspberry Pi car, with wireless camera and fire-sensor experiments.", links: [{ label: "Watch demo", url: "https://youtu.be/HdcvcBxZMno" }] },
  { title: "Video lecture segmentation and tagging", category: "RESEARCH · 2010–2011", description: "Built a video-mining tool to search for and within video lectures and jump to topics, using OCR and frame analysis with Tesseract, GOCR, and OpenCV.", links: [] },
  { title: "Apache Kafka contribution", category: "OPEN SOURCE · MERGED MAY 2025", description: "Fixed large-payload file loading in Kafka's producer performance tool, avoiding NegativeArraySizeException during load tests. The fix was merged into the upstream project.", links: [{ label: "Merged contribution", url: "https://github.com/apache/kafka/pull/18391" }] },
  { title: "Trader", category: "MARKET RESEARCH", description: "Python research, backtesting, and paper-trading workflows with frozen experiment inputs and persistent paper portfolios.", links: [{ label: "Open project", url: "https://trader.manojmathivanan.com" }, { label: "Source", url: "https://github.com/manoj-mathivanan/trader_all" }] },
  { title: "Kafka bootstrap diagnostics", category: "DEVELOPER TOOLING", description: "Java / Spring Boot HTTP request-inspection service for bootstrap diagnostics. A development prototype; broker forwarding is listed as future work in its README.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/kafka-bootstrap-proxy" }] },
  { title: "Warehouse robot", category: "ROBOTICS", description: "Raspberry Pi warehouse automation prototype that receives an order and location from an app, retrieves the item, and brings it to a dispatch point.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/warehouse-robot" }, { label: "Watch demo", url: "https://youtu.be/aI32BWp6zB4" }] },
  { title: "Smart water bottle", category: "CONNECTED DEVICES", description: "Raspberry Pi proof of concept that tracks water consumption, sends drinking reminders, and motivates teams with a leaderboard. Smart Bottle and Smart Health Index placed second at SAP's IoT Chef hackathon.", links: [] },
  { title: "Smart helmet", category: "CONNECTED DEVICES", description: "Prototype combining two-way Bluetooth audio with an Android app for navigation, music, and call handling through voice interaction.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/smart-helmet" }] },
  { title: "Home automation & Raspberry Pi", category: "HARDWARE EXPLORATIONS", description: "Mobile-controlled switches, power monitoring, and experiments with Raspberry Pi and ESP8266. Demos include wireless home automation and an Android-controlled remote car.", links: [{ label: "Raspberry Pi source", url: "https://github.com/manoj-mathivanan/RaspberryPi" }, { label: "ESP8266 source", url: "https://github.com/manoj-mathivanan/ESP8266" }, { label: "Home automation demo", url: "https://youtu.be/WkdBBF2dDrw" }, { label: "Remote car demo", url: "https://youtu.be/HdcvcBxZMno" }] },
  { title: "Mall Scout", category: "MOBILE APPS", description: "Mall-navigation and parking prototype with offers, shared discounts, and QR-code gamification.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/Mall-Scout" }] },
  { title: "School Bus Tracking", category: "PROJECT ARCHIVE", description: "An earlier personal project. Browse the repository for its implementation.", links: [{ label: "Source", url: "https://github.com/manoj-mathivanan/SchoolBusTracking" }] },
  { title: "Mobile app experiments", category: "PROJECT ARCHIVE", description: "Earlier StatusApp, Poke-App, and phone-to-phone notification projects, collected here with their original repositories.", links: [{ label: "StatusApp", url: "https://github.com/manoj-mathivanan/StatusApp" }, { label: "Poke-App", url: "https://github.com/manoj-mathivanan/Poke-App" }, { label: "Phone notifications", url: "https://github.com/manoj-mathivanan/Phone-TO-Phone-notification" }] },
];

// Shared content for the static resume page and downloadable PDF.
export const onePage = {
  name: "Manoj Mathivanan",
  title: "Staff Software Engineer | Distributed Systems & Kafka Platforms",
  summary: "Software architect and technical lead building distributed messaging platforms, cloud infrastructure, and developer frameworks. Experience across PayPal, SAP Labs, and Infosys, with a focus on reliability, automation, and practical AI tooling.",
  skills: "Kafka, Kafka Connect, MirrorMaker 2, Java, Python, GCP, Kubernetes/GKE, Strimzi, Terraform, Helm, Docker, Ansible, Harness CI/CD, mTLS/SASL, Datadog, MCP, RAG, LangGraph, Claude, REST/OData",
  jobs: [
    { company: "PayPal", role: "Staff Software Engineer / Kafka Platform", period: "Feb 2021 - Oct 2026 snapshot", bullets: [
      "Architected production Kafka on GKE with Strimzi, Helm, and Harness; automated infrastructure and configuration as code, cutting cluster provisioning from about 3 days to under 15 minutes (2026).",
      "Redesigned Kafka QA infrastructure using Terraform, Ansible, and Docker; reduced monthly cost from about $39,000 to $4,000 and cluster installation from hours to 5 minutes (2023).",
      "Designed an autoscaling SNI gateway using one IP per GKE cluster with end-to-end mTLS, highly available discovery, and an architecture-forum-approved cloud migration strategy (2026).",
      "Built the Kafka MCP server and Slack-triggered agentic AI troubleshooting using LangGraph, Claude, MCP and RAG; estimated data collection and analysis fell from at least 2 hours to under 2 minutes (2025-2026).",
      "Led MirrorMaker 2 migration from VMs to a Kubernetes-based platform, secure cross-environment replication, SASL adoption, and Datadog observability modernization (2024-2025).",
      "Contributed Apache Kafka's large-payload performance-test fix (KAFKA-18115, PR #18391), merged upstream in May 2025.",
      "Built and tested restart-free Kafka cluster switching: producers 1-2 s, consumers 5-10 s, no message loss in three test scenarios; client rollout pending as of October 2026.",
      "Led architecture reviews, mentoring, and delivery planning for five engineers; covered interim management in 2025 and planned/groomed 351 stories in 2026. Earlier work included regional Kafka setup and automated disaster recovery.",
    ] },
    { company: "SAP Labs India", role: "Associate Development Architect", period: "Mar 2012 - Feb 2021", bullets: [
      "Developed Java frameworks for CDS/OData services, a multi-tenant enterprise backend-as-a-service application, and REST record/playback testing; collaborated with the research team in Germany.",
      "Automated mobile-platform performance tests from 2 hours to 10 minutes. Built a student-data analysis system for three educational institutes in Uganda and an internal crowdsourcing platform.",
    ] },
    { company: "Infosys", role: "Quality Engineer", period: "Jun 2011 - Mar 2012", bullets: ["Tested Citizens Bank's BIC teller application and developed comprehensive test coverage."] },
  ],
  projectText: "Trader: Python market research, backtesting, and paper trading. Kafka bootstrap diagnostics: Java/Spring Boot prototype. IoT: warehouse robot, smart water bottle with reminders and leaderboard, smart helmet, and home automation.",
  educationText: "Executive Certification, Advanced Data Science and Applications - IITM Pravartak (Jan 2025). M.Tech, Software Systems - BITS Pilani (2015-2017). B.Tech, Computer Science - Amrita University (2011).",
  recognitionText: "3 SAP Catalyst awards (top 5% for three consecutive years); SAP Innovation Week winner (2014, 2016, 2018); SAP d-code Demo Jam finalist (2014); 7 PayPal peer recognitions in 2026.",
  footnote: "Career snapshot: October 2026. Staff title documented in 2025. Education and career corrections confirmed by the owner in November 2026.",
};
