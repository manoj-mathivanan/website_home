// Public skills supported by career summaries, resumes, and documented projects.
// Keep the detailed provenance in content-notes.md; do not publish private reviews.
export const skillGroups = {
  "Systems & cloud": [
    "Apache Kafka", "Kafka Connect", "MirrorMaker 2", "Apache ZooKeeper",
    "Distributed systems", "Event-driven architecture", "Messaging & streaming",
    "Data replication", "Disaster recovery", "High availability",
    "Google Cloud Platform", "Kubernetes", "Google Kubernetes Engine (GKE)",
    "Strimzi", "Cloud architecture", "Cloud migration", "Cloud cost optimization",
    "Capacity planning", "Load balancing", "SNI routing", "Service discovery",
    "Google Cloud Storage", "Linux", "Ubuntu",
  ],
  "AI & data": [
    "Agentic AI", "LangGraph", "Anthropic Claude", "Model Context Protocol (MCP)",
    "Retrieval-augmented generation (RAG)", "Slack integrations", "LLM evaluation",
    "Data science", "Data analytics", "Machine learning", "GitHub Copilot",
  ],
  "Security & reliability": [
    "TLS / SSL", "Mutual TLS (mTLS)", "SASL", "Access control lists (ACLs)",
    "Encryption key management / CMEK", "Certificate rotation", "Network security",
    "SSH", "Production support", "Incident management", "Root cause analysis",
    "Site reliability engineering", "Monitoring & alerting",
  ],
  "Development": [
    "Java", "Python", "Node.js", "JavaScript", "C", "C++", "HTML",
    "SQL", "MySQL", "PL/SQL", "MongoDB", "NoSQL", "R",
    "Spring", "Spring Boot", "REST APIs", "OData", "Core Data Services (CDS)",
    "SAP HANA", "SAP UI5", "Java EE", "Microservices", "Multithreading",
    "Object-oriented programming", "Tomcat", "Jetty", "Cloud Foundry",
    "Android development", "iOS development", "BlackBerry development",
    "Eclipse", "Git", "Gerrit",
  ],
  "Automation & delivery": [
    "Terraform", "Infrastructure as code", "Ansible", "Ansible Semaphore",
    "Puppet", "Docker", "Helm", "Harness", "Jenkins", "CI/CD",
    "Shell scripting", "Maven", "ServiceNow integration", "Configuration management",
    "OS upgrade automation", "Rolling deployments",
  ],
  "Observability & testing": [
    "Datadog", "Micrometer", "SignalFx", "OpenTelemetry", "Dashboard design",
    "Kafka consumer lag diagnostics", "Performance testing", "Load testing",
    "Performance benchmarking", "Functional testing", "Unit testing", "JUnit",
    "Test automation", "LoadRunner", "Introscope", "Record-and-playback testing",
    "Compression benchmarking (Snappy / Zstandard)",
  ],
  "Architecture & leadership": [
    "Software architecture", "System design", "Solution architecture",
    "Technical leadership", "Mentoring", "Code review", "Architecture reviews",
    "Agile delivery", "Scrum", "Sprint planning", "Backlog refinement",
    "Technical roadmaps", "Project delivery", "Stakeholder management",
    "Team management", "Technical documentation", "Knowledge sharing",
    "Technical talks & workshops", "Open-source contribution",
  ],
  "Hardware & IoT": [
    "Raspberry Pi", "Arduino", "ESP8266", "Internet of Things (IoT)",
    "Robotics prototyping", "GPS integration", "GPIO", "Bluetooth integration",
    "Optical character recognition (OCR)", "OpenCV", "Tesseract", "GOCR",
  ],
};

export const skills = Object.entries(skillGroups).flatMap(([category, names]) =>
  names.map(name => ({ name, category })),
);
