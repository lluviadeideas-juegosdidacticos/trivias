# Protocol Conflict Resolution — v1.0

## Description
This protocol defines how conflicts between protocols are resolved within the Janus system to ensure deterministic and consistent outcomes.

## Problem it solves
When multiple protocols apply to the same situation, they may impose conflicting requirements.
Without a resolution mechanism, decisions become arbitrary and non-reproducible.

## Rule
Protocol conflicts MUST be resolved explicitly using a deterministic hierarchy or declared exception.
Implicit or ad-hoc conflict resolution is non-compliant.

## Operational definition

- **Protocol conflict:**
	A situation where two or more protocols impose incompatible requirements on the same surface, interaction, or system behavior.

- **Resolution:**
	The explicit decision of which protocol takes precedence in a given context.

- **Hierarchy:**
	A predefined priority order between protocols.

Two requirements are incompatible when complying with one makes it impossible to comply with the other simultaneously in the same context.

## Resolution mechanisms

The canonical protocol hierarchy is defined in the Frontend Product Layer Index. For cross-layer conflicts, hierarchy must be declared in the Framework Stack governance documents.

Conflicts MUST be resolved using one of the following:

### 1. Hierarchical precedence

If a hierarchy exists, the higher-priority protocol overrides the lower-priority one.

### 2. Exception Governance

If no hierarchy resolves the conflict, the decision MUST be handled as an exception under Exception Governance v1.0.

## Constraints

- Conflict resolution MUST be explicit
- Conflict resolution MUST be traceable
- Conflicts MUST NOT be resolved implicitly through implementation behavior

Examples in practical application are illustrative only. Precedence must always reference a formal hierarchy declaration, not be inferred from examples.

## Practical application

If Progressive Disclosure conflicts with Critical Information visibility, Critical Information takes precedence.
If Clarity Over Cleverness conflicts with Debug Visibility requirements, the conflict must be resolved via Exception Governance.

## Notes

- This protocol applies across all layers of the Janus system
- This protocol depends on Exception Governance v1.0
- This protocol ensures deterministic system behavior under conflict

The hierarchy defined in the Frontend Product Layer Index is the authoritative source for hierarchical precedence within that layer. Any update to the hierarchy must be reflected in both documents simultaneously.