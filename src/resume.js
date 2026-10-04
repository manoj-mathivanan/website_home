// Historical source: Manoj_Resume_Feb2024.docx. Update these facts with the next resume.
export const resume = {
  snapshot: "February 2024",
  experience: [
    {
      company: "PayPal",
      location: "Chennai, India",
      period: "2021 — 2024 snapshot",
      role: "MTS 2 · Lead Software Architect",
      note: "February 2021 – ongoing as of the February 2024 resume",
      summary: "Scalable messaging and streaming for PayPal products.",
      details: [
        "Technical lead for a highly scalable messaging and streaming platform serving PayPal products.",
        "Transformed deployment and maintenance using containers and Ansible playbooks.",
        "Designed and developed disaster recovery for the messaging platform, increasing availability to 99.99%.",
      ],
      tags: ["Distributed systems", "Messaging", "Disaster recovery"],
      impact: { value: "99.99%", label: "platform availability" },
    },
    {
      company: "SAP Labs",
      location: "Bangalore, India",
      period: "2012 — 2021",
      role: "Associate Development Architect",
      note: "March 2012 – February 2021",
      summary: "Cloud frameworks, data services, and developer tools.",
      details: [
        "Worked with a research team in Germany on database-independent Core Data Services (CDS) modeling and exposure through the OData protocol.",
        "Developed a Java annotation-based extension framework that let SAP cloud developers expose HANA databases as OData services with minimal coding.",
        "Created a framework for end-to-end REST service testing with record and playback support.",
        "Shared knowledge with the developer community through talks and workshops at SAP Tech Hub.",
        "In a performance engineering role, built mobile test apps for Android, iOS, and BlackBerry and used Introscope to capture performance results. Automated tests reduced a two-hour workflow to ten minutes.",
      ],
      tags: ["Java", "OData", "Developer frameworks", "Performance"],
      impact: { value: "2h → 10m", label: "performance test workflow" },
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
      ],
      tags: ["Quality engineering", "Application testing"],
    },
  ],
  skills: [
    { name: "Kafka", category: "Systems & cloud" },
    { name: "Messaging & streaming", category: "Systems & cloud" },
    { name: "Google Cloud Platform", category: "Systems & cloud" },
    { name: "Software architecture", category: "Systems & cloud" },
    { name: "Java", category: "Development" },
    { name: "Spring Boot", category: "Development" },
    { name: "Tomcat", category: "Development" },
    { name: "Jetty", category: "Development" },
    { name: "Agile planning & execution", category: "Development" },
    { name: "Docker", category: "Automation" },
    { name: "Ansible", category: "Automation" },
    { name: "Puppet", category: "Automation" },
    { name: "Shell scripting", category: "Automation" },
    { name: "Git", category: "Automation" },
    { name: "Jenkins", category: "Automation" },
    { name: "Maven", category: "Automation" },
    { name: "Raspberry Pi", category: "Hardware & IoT" },
    { name: "Arduino", category: "Hardware & IoT" },
  ],
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
      degree: "M.Tech · Software Systems",
      school: "Birla Institute of Technology, Pilani",
      year: "2017",
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
