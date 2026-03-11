# 🤖 SENTINELLE-96: AGENT_SPEC

**Version**: 2.0.0 (Swarm Enabled)
**Type**: Autonomous Forensic Auditor
**Host**: Le Registre Loi 96 Compliance Engine

## CAPABILITIES
- **Discovery**: Scrapes industry registries for businesses lacking `.qc.ca` or French localized digital presence.
- **Forensic Scoring**: Analyzes sites for Bill 96 liability (Linguistic Audit).
- **Outreach**: Automated drafting of formal compliance notices (FR-CA).
- **Persistence**: Memory logging via `memory.json` and `findings.md`.

## SWARMS
1. **Linguistic_Scout_v1**: Rapid discovery of new leads.
2. **Outreach_Agent_v2**: Handles communication protocols.

## HANDSHAKE
Integrates with `OpenClaw` for LLM-driven inference and `Anti-Gravity` for deployment.
