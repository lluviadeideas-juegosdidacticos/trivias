# Frontend Product Layer — Index v1.1

## Purpose
This document defines the canonical registry, reading order, and application model for all protocols within the Frontend Product Layer.

---

## Scope
This index applies to all protocols that directly affect user-facing behavior, interaction, and interface states.

---

## Canonical protocol list

The following protocols constitute the active Frontend Product Layer:

1. User Surface First — v1.2  
2. Clarity Over Cleverness — v1.2  
3. Predictable Interaction States — v1.0  
4. Feedback Before Navigation — v1.0  
5. Error States Are Actionable — v1.1  
6. Loading States Are Visible — v1.1  
7. Empty States Are Intentional — v1.1  

---

## Reading order

Protocols must be understood in the following order:

1. User Surface First  
2. Clarity Over Cleverness  
3. Predictable Interaction States  
4. Feedback Before Navigation  
5. Loading States Are Visible  
6. Error States Are Actionable  
7. Empty States Are Intentional  

The reading order differs from the canonical list to reflect conceptual dependency rather than registry order.  
Loading States are evaluated before Error States because waiting is a precondition to failure in user perception.

---

## Application model

- Higher-order protocols constrain but do not override lower-order protocols.  
- Lower-order protocols may not contradict higher-order ones.  
- In case of apparent contradiction, conflict resolution rules apply.  
- All protocols are cumulative unless explicitly stated otherwise.  

---

## Conflict resolution

In case of conflict:

1. User Surface First has highest priority  
2. Clarity Over Cleverness overrides implementation complexity  
3. State-related protocols (Predictable Interaction States, Loading, Error, Empty) must remain consistent as a group  
4. If conflict persists, prefer the option that reduces user uncertainty.