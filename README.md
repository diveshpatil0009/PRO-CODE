PROCODE: AI-Powered Brand Governance Platform 🛡️

Organizations struggle to maintain a consistent, accurate, and trustworthy brand identity when content is created by multiple employees, agencies, and AI tools. Procode is an AI-powered Brand Governance Platform that analyzes text and supported images against approved brand rules, facts, terminology, and visual assets before publication.

This project was built for the Inkloom AI Hackathon.

🚀 Key Features

Smart Rule Uploader: Extract guidelines directly from uploaded brand PDFs using client-side PDF.js parsing.

Living Fact Sheet & Dictionary: Structured storage for corporate facts, expiration dates, and banned/preferred terminology mapping.

Intelligent Content Review Studio: A unified workspace to paste marketing copy for instant evaluation against active brand rules.

Explainable Quality Report (Gemini API): An AI evaluation engine that assigns a Confidence Score, categorizes issues by severity, and cites specific evidence from the uploaded guidelines.

Evidence & Correction Engine: Provides automated, intent-preserving suggestions to fix content.

Human-in-the-Loop Review System: Role-based workflow (Content Creator vs. Brand Manager) to approve, reject, or request revisions.

Governance Dashboard & Audit Trail: Interactive Chart.js visualizations for compliance rates, issue tracking, and immutable logging of all checks.

🛠️ Technology Stack

Frontend: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons, Chart.js

Backend / API: Next.js API Routes / Python (Orchestration)

Database: PostgreSQL (Mocked via state in MVP)

AI Engine: Google Gemini 1.5 Flash API (Structured Prompting)

Document Parsing: PDF.js

⚙️ Local Setup & Installation

To run this prototype locally, follow these steps:

1. Clone the repository

git clone https://github.com/diveshpatil0009/PRO-CODE-FINAL.git
cd PRO-CODE-FINAL


2. Install dependencies

npm install


3. Set up Environment Variables

Create a .env or .env.local file in the root directory and add your Google Gemini API Key:

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here


4. Run the Development Server

npm run dev


Open http://localhost:3000 in your browser to view the application.

🏗️ Architecture Summary

Procode utilizes a decoupled architecture:

Frontend Layer: Drives the interactive UI, manages application state, and handles client-side PDF parsing to extract raw text.

Rule Context Builder: Combines extracted PDF text, manual fact inputs, and dictionary rules into a unified "Knowledge Payload."

LLM Evaluator: We use strict, zero-shot structured prompting with the Gemini API to act purely as a semantic evaluator. It takes the Knowledge Payload and user content, returning JSON-formatted violations and exact quote citations.

🗺️ Future Roadmap

Q1 2027 - Enterprise CMS Integrations: Plugins for WordPress, Contentful, and Slack for inline checking.

Q2 2027 - Cross-Language Guardian: Localized terminology dictionaries for global brand safety.

Q3 2027 - Conflicting Rules Resolver: AI sub-agent to scan and flag contradictory guidelines within the Knowledge Base.

Q4 2027 - Automated Expiry Radar: Automated alerts for Brand Managers when statistics approach expiration.

👥 Team Procode

Divesh Kapil Patil - Team Leader & Website Planner

Nupul Patil - UX Designer

Swapnil Deore - Frontend Developer

Shrutesh Hamanapurkar - Backend Developer

Built with ❤️ for the AI Hackathon
