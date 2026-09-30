# BLESSIKAA MASTER CONSTITUTION & DEVELOPMENT MEMORY
**Project Name**: BLESSIKAA ("Build a blessed life")  
**Architecture Role**: Lead Full-Stack Architect, UX/UI Systems Architect, AI Knowledge Base Architect  
**Continuity Standard**: Parallel Development Track — Every feature implemented in Blessikaa is simultaneously reflected in the machine-readable AI Knowledge Base (`/src/data/aiKnowledgeBase.ts` and `/blessikaa-ai/*`).

---

## 1. Product Identity & Core Architecture
- **Core Philosophy**: Complete life-care, service, personal management, and habit transformation ecosystem built on 21-day neuroplasticity milestones, habit stacking, and 69+ real-world services.
- **Targets**: Android App, Web App, Admin Portal, and future Blessikaa AI Agent Companion.
- **Source of Truth Hierarchy**:
  1. Actual production codebase & schema implementation
  2. Documented business logic & workflow constraints
  3. AI Knowledge Base & Tool Specifications
  4. Planned features (strictly labeled as `PLANNED` or `IN DEVELOPMENT`)

---

## 2. Structured Knowledge Base Directory Map
All domain understanding is cataloged across structured records:
- `/blessikaa-ai/product`: Core vision, problems solved, value propositions.
- `/blessikaa-ai/services`: 69+ ecosystem services with schemas, workflows, and OCR vault specifications.
- `/blessikaa-ai/challenges`: 69+ Blessikaa master pathways & community challenges.
- `/blessikaa-ai/workflows`: Step-by-step state machines (Start -> Input -> Validation -> DB Action -> State Transition).
- `/blessikaa-ai/tools`: Future AI Agent Tool specifications (inputs, outputs, permissions, confirmations, reversible state).
- `/blessikaa-ai/security`: Role-based access control, privacy sandboxing, zero-hallucination guardrails.
- `/blessikaa-ai/decisions`: Architectural decision records (ADRs) explaining *why* decisions were made.
- `/blessikaa-ai/changelog`: Continuous synchronization log of every turn and release.

---

## 3. Mandatory AI Knowledge Synchronization Protocol
At the conclusion of every feature implementation, the AI Knowledge Architect must:
1. Verify what was actually implemented (no mock stubs).
2. Update `/src/data/aiKnowledgeBase.ts` and `/blessikaa-ai/`.
3. Update Tool Specifications for the future AI agent.
4. Record Development Decisions and Change Log.
