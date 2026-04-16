# AI-Powered Pharma CRM: HCP Interaction Intelligence System

A modern **AI-driven CRM** built for Pharmaceutical Medical Affairs and Sales Representatives.  
Talk naturally → AI understands → Auto-fills the form → Saves structured HCP interactions with intelligence.

**"Smart CRM + Pharma Compliance Engine"**



---

## Key Features

- **Natural Language Interaction** — Speak or type casually about HCP meetings
- **Intelligent Auto-Fill** — AI extracts doctor name, product, disease area, sentiment, and notes
- **Smart Intent Routing** — Automatically detects whether to **log**, **edit**, **search**, **summarize**, or **check compliance**
- **Real-time Form Sync** — AI responses instantly populate the CRM form
- **Multi-Tool AI Agent** — Powered by LangGraph with 6 specialized tools
- **Conversational Memory** — Remembers context across messages for better follow-ups
- **Pharma Compliance Engine** — Flags potential compliance risks
- **Recommendation Engine** — Suggests next best actions
- **Beautiful Dark UI** — Modern, premium interface with orange accent

---

## Tech Stack

### Frontend
- **React.js** + **Tailwind CSS**
- **Lucide React** (icons)
- **Context API** for shared form state
- Fully responsive dark theme (custom design system)

### Backend
- **FastAPI** (Python)
- **LangGraph** (Agentic Workflow)
- **Pydantic** for structured outputs
- **SQLite** (with easy upgrade path to PostgreSQL)

### AI Layer
- **LangGraph** for stateful multi-tool agent
- **Multiple specialized tools**:
  - `log_interaction_tool`
  - `edit_interaction_tool`
  - `search_interaction_tool`
  - `recommendation_tool`
  - `summary_tool`
  - `compliance_check_tool`

---

## Architecture

```mermaid
graph TD
    A[Frontend React UI] --> B[FastAPI Backend]
    B --> C[LangGraph Agent]
    C --> D[Intent Detection & Routing]
    D --> E[Tools Layer]
    E --> F[Database SQLite]
    C --> G[Structured Response]
    G --> A
