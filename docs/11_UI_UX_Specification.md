 # UI/UX Specification
## CityPulse: Design System, Visual Metaphor, and 10-Second Glanceability

---

## 1. Design Philosophy
CityPulse is built on the principle of **Glanceable Situational Awareness**.
Existing municipal dashboards resemble complex GIS analytical suites or stock trading terminals filled with dense tables, dozens of checkboxes, and confusing legends. Ordinary urban residents will not spend 5 minutes deciphering layers before heading to work.

**The CityPulse Rule:** *A user must know within 10 seconds if their neighborhood is calm or experiencing disruptions, and why it matters.*

---

## 2. Visual Identity & Color Palette

The interface uses a tailored, sleek dark-mode aesthetic with high-contrast status tokens.

| Token Name | Hex Code | Visual Metaphor | Application |
|---|---|---|---|
| `--bg-primary` | `#090D16` | Midnight Navy | Page background |
| `--bg-secondary` | `#0F172A` | Deep Slate | Header, cards, panel backgrounds |
| `--border-subtle`| `rgba(255, 255, 255, 0.08)` | Frosted glass edge | Card borders, modal dividers |
| `--pulse-calm` | `#10B981` | Emerald Vitality | Calm status, healthy feed, steady heartbeat |
| `--pulse-elevated`| `#F59E0B` | Amber Caution | Elevated activity, weather advisory, minor delays |
| `--pulse-alert` | `#EF4444` | Crimson Urgency | Alert status, multi-feed correlation, severe disruptions |

---

## 3. The "Pulse" Metaphor & Micro-Animations

### 3.1 Alive Status Indicator
- A living civic pulse dot beside the application logo pulses at a rhythmic frequency (1.2s cycle) to convey live streaming connectivity.
- Zones in `Alert` status exhibit a gentle red breathing glow around their card border (`box-shadow: 0 0 15px rgba(239, 68, 68, 0.3)`).

### 3.2 Accessibility & Color-Blindness Safeguards
Status is **never communicated by color alone**:
1. **Calm:** Emerald accent + Check circle icon + Label `"CALM"`.
2. **Elevated:** Amber accent + Triangle warning icon + Label `"ELEVATED"`.
3. **Alert:** Crimson accent + Hexagonal alert icon + Label `"ALERT"`.

---

## 4. Screen Layout & Wireframes

### 4.1 Header Bar
- Logo: `CityPulse` with pulsing green heartbeat beacon.
- Status Pill: `"LIVE CIVIC HEALTH"`.
- Event Tracker: AmiHacks Track B indicator and current UTC clock.

### 4.2 Top Alert Banner (Conditional)
- Appears only when one or more zones enter `Alert` status.
- Text: `"ALERT: High-activity anomalies detected in Zone 3. Review active correlations below."`
- Label: `"Possible links active"`.

### 4.3 Main Grid (3-Column Layout)
- **Left 2 Columns:** Metropolitan Pulse Map (interactive 4-quadrant spatial zone grid or Leaflet layer). Hovering or clicking a zone triggers drill-down telemetry.
- **Right 1 Column:** Feed Ingestion Health monitor showing latency and cadence for Weather, Transit, and 311 streams.

### 4.4 Zone Cards Grid (4 Columns)
- Cards for `Zone 1` through `Zone 4`.
- Each card shows:
  - Zone name and status pill badge.
  - Plain-language summary sentence in crisp, legible typography.
  - Count of active events in the 30-minute window.
  - Call-to-action button: `"View details →"`.

### 4.5 Diagnostics Modal (`ZoneDetailModal`)
- Modal opens when clicking any zone card.
- Displays:
  - **Plain-Language Synthesis** banner.
  - **Active Correlation Flags** with rule explanations and `"Possible Link"` badges.
  - **Chronological Event Stream** with source pills (`weather`, `transit`, `311`), timestamp, and descriptions.

---

## 5. Responsive Design Breakpoints
- **Mobile (< 768px):** Single column stack. Top alert banner, followed by vertical zone cards, followed by feed health widget.
- **Tablet (768px - 1024px):** 2-column grid.
- **Desktop (> 1024px):** Full 3-column panoramic layout optimized for rapid command-center inspection.
