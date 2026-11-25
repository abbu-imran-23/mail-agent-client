import {
  BriefcaseBusiness,
  CalendarCheck,
  Code2,
  FileText,
  Mail,
  Search,
} from "lucide-react";

export const quickSuggestions = [
  {
    id: 1,
    label: "Research Assistant",
    prompt:
      "Create an AI research assistant that can search the web, gather information from multiple sources, analyze findings, and generate comprehensive research reports with citations.",
  },
  {
    id: 2,
    label: "Code Review Agent",
    prompt:
      "Create an AI code review agent that analyzes pull requests, identifies bugs, security vulnerabilities, performance issues, and suggests improvements following coding best practices.",
  },
  {
    id: 3,
    label: "Email Assistant",
    prompt:
      "Create an AI email assistant that can read incoming emails, categorize them by priority, summarize conversations, draft contextual replies, and identify emails requiring immediate attention.",
  },
  {
    id: 4,
    label: "Data Analyst",
    prompt:
      "Create an AI data analyst agent that can process CSV and Excel files, analyze datasets, identify trends and anomalies, generate visualizations, and provide actionable business insights.",
  },
  {
    id: 5,
    label: "Meeting Assistant",
    prompt:
      "Create an AI meeting assistant that can process meeting transcripts, extract key discussion points, identify decisions, assign action items to participants, and generate structured meeting summaries.",
  },
];

export const templates = [
  {
    id: 1,
    title: "Find Latest Jobs",
    description:
      "Search job portals for relevant opportunities, filter jobs based on your skills and experience, and deliver a daily job digest.",
    icon: BriefcaseBusiness,
  },
  {
    id: 2,
    title: "Daily Inbox Summary",
    description:
      "Analyze your inbox, categorize important emails, summarize conversations, and highlight messages that need your attention.",
    icon: Mail,
  },
  {
    id: 3,
    title: "Research a Topic",
    description:
      "Research any topic using multiple sources, extract key insights, verify information, and generate a structured report.",
    icon: Search,
  },
  {
    id: 4,
    title: "Meeting Action Tracker",
    description:
      "Analyze meeting transcripts, identify decisions, extract action items, assign owners, and track pending tasks.",
    icon: CalendarCheck,
  },
  {
    id: 5,
    title: "Document Analyzer",
    description:
      "Read and analyze documents, extract important information, summarize key findings, and answer questions from their content.",
    icon: FileText,
  },
  {
    id: 6,
    title: "Code Assistant",
    description:
      "Analyze code repositories, identify bugs, suggest improvements, review pull requests, and generate technical documentation.",
    icon: Code2,
  },
];
