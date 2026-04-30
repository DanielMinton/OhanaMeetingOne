# OHANA RECOVERY -- LIVE MEETING APPLICATION

## Build Instructions

**Project Codename:** `ohana-live`
**Author:** Daniel Minton, Founder -- Ohana Recovery
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, html2canvas + jsPDF, Web Audio API
**Deploy Target:** Vercel (or any Node-compatible host; M365 iframe embed optional)

---

## 0. WHAT THIS IS

This is a **live meeting management application** for Ohana Recovery's Core Organizational Planning Meetings. It replaces a static HTML meeting packet with a fully interactive, real-time, guided meeting experience that a designated secretary can operate during a live session.

This is not a template. This is not a form. This is a **living, breathing meeting cockpit** built for a recovery community that runs 365 nights a year and refuses to look, feel, or operate like every other nonprofit that got its UI from a grant writer's nightmare.

The application walks the meeting through each agenda section in sequence, enforces time allocation per topic, captures all notes/decisions/motions/attendance/action items in real time, and on completion generates a professional, password-protected PDF of the official meeting minutes that gets distributed to every attending member.

---

## 1. DESIGN SYSTEM AND AESTHETIC DIRECTION

### 1.1 Core Philosophy

**Dark. Warm. Alive. Structured but never sterile.**

This is an organization born from lived experience in recovery. The design language should feel like walking into a room where serious people do serious work, but the lights are low, the energy is focused, and nobody is pretending to be something they're not. Think: a command center run by people who give a damn, not a hospital waiting room.

### 1.2 Color Palette (CSS Custom Properties)

```css
:root {
  /* Foundations */
  --bg-primary: #07090b;
  --bg-panel: #10161a;
  --bg-panel-soft: #151d22;
  --bg-elevated: #1a2228;
  --bg-input: #0d1317;

  /* Text */
  --text-primary: #f3f7f8;
  --text-secondary: #c4d0d5;
  --text-muted: #7a8f98;
  --text-ghost: #3e5059;

  /* Brand Accents */
  --teal: #31d6c4;
  --teal-glow: rgba(49, 214, 196, 0.15);
  --teal-deep: #163c3b;
  --orange: #ff9f43;
  --orange-glow: rgba(255, 159, 67, 0.12);
  --purple: #9d7cff;
  --purple-glow: rgba(157, 124, 255, 0.1);

  /* Semantic */
  --success: #2ecc71;
  --warning: #ff9f43;
  --danger: #ff6b6b;
  --info: #31d6c4;
  --line: #27343b;
  --line-subtle: #1e2a31;

  /* Shadows */
  --shadow-ambient: 0 22px 70px rgba(0, 0, 0, 0.45);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-glow-teal: 0 0 40px rgba(49, 214, 196, 0.08);
  --shadow-glow-orange: 0 0 40px rgba(255, 159, 67, 0.06);
}
```

### 1.3 Typography

**Primary Display:** `"Outfit", sans-serif` (Google Fonts) -- clean geometric with personality, not corporate
**Body Text:** `"IBM Plex Sans", sans-serif` (Google Fonts) -- engineered readability, pairs well with Outfit
**Monospace (timestamps, codes):** `"JetBrains Mono", monospace`

Font loading: use `next/font/google` with `display: swap`. Preload both.

### 1.4 Background Treatment

The body background is NOT a flat color. It is a layered composition:

1. **Base:** `#07090b` solid
2. **Gradient layer:** Radial gradient from top-left (teal at 12% opacity, 34% spread) and top-right (purple at 12% opacity, 30% spread)
3. **Noise texture:** Subtle SVG noise filter at 3-5% opacity overlaid via `::before` pseudo-element on the body. This gives the dark surfaces a tactile, film-grain quality.
4. **Parallax particle field:** A `<canvas>` element behind all content, rendering 40-60 slow-drifting particles (tiny dots, 1-2px, at 5-10% opacity, in teal/purple/orange). These drift gently on a sine wave. They respond subtly to scroll position (parallax at 0.15x rate). They are NOT distracting. They are atmospheric. Think: dust motes in a dark room catching the edge of light.

### 1.5 Micro-interactions and Animation Rules

**Motion library:** Framer Motion for React components. CSS transitions for simple hover states.

**Animation principles:**
- **Page transitions:** Each agenda section slides in from the right with a staggered reveal (title first at 0ms, content blocks at 80ms intervals). Use `spring` easing with `stiffness: 260, damping: 30`.
- **Card hover:** Cards lift 2px on Y axis with a subtle box-shadow expansion. Transition: 200ms ease-out.
- **Button interactions:** Scale to 0.97 on press, 1.02 on hover. Active state gets a brief teal glow pulse.
- **Timer ring:** Smooth SVG stroke-dashoffset animation. The ring is always visible and always moving when a section is active.
- **Section completion:** When a section is completed, a brief particle burst (8-12 particles, teal/orange) shoots from the "Complete" button. 300ms duration, physics-based decay.
- **Signature capture:** Ink trails should have slight pressure simulation -- thicker at slow speeds, thinner at fast speeds.
- **Scroll-triggered reveals:** Elements below the fold use `IntersectionObserver` to fade-and-rise into view (translateY 20px to 0, opacity 0 to 1, 400ms).

**What NOT to do:**
- No bouncing logos
- No rainbow gradients
- No loading spinners that look like 2014
- No transitions longer than 500ms unless it is the timer animation
- No animation that blocks user interaction

### 1.6 Component Design Language

- **Cards/Panels:** `border-radius: 18px`, 1px solid `var(--line)`, background is `var(--bg-panel)` with a subtle inner gradient. Never flat white/black.
- **Input fields:** Dark recessed look. `var(--bg-input)` background, 1px border `var(--line)`, `border-radius: 12px`. On focus: border transitions to `var(--teal)` with a faint teal glow shadow.
- **Buttons:** Primary buttons are solid teal with dark text. Secondary buttons are ghost (transparent bg, teal border). Danger buttons are ghost with red border/text.
- **Tables:** Rounded container with `overflow: hidden`, header row uses teal-tinted background, rows alternate with extremely subtle shade differences.
- **Callout boxes:** Gradient background (teal-to-purple at very low opacity), left border accent, rounded corners.

---

## 2. APPLICATION ARCHITECTURE

### 2.1 Pages and Routes

```
/                         -- Landing / authentication gate
/meeting                  -- Active meeting interface (protected)
/meeting/[sectionId]      -- Deep link to specific section (within meeting)
/minutes/[meetingId]      -- Read-only minutes view (post-meeting, password-protected)
```

### 2.2 State Management (Zustand)

A single Zustand store manages the entire meeting lifecycle:

```typescript
interface MeetingState {
  // Authentication
  isAuthenticated: boolean;
  secretaryName: string;
  sessionPassword: string;

  // Meeting metadata
  meetingId: string; // UUID generated on session start
  meetingDate: string;
  meetingStartTime: string;
  meetingEndTime: string | null;
  meetingType: 'core-checkin' | 'organizational-planning' | 'formal-board';
  platform: string; // e.g. "Zoom", "In-Person"

  // Navigation
  currentSectionIndex: number;
  sectionTimers: Record<string, SectionTimer>;
  completedSections: string[];

  // Attendance
  attendees: Attendee[];

  // Content capture per section
  sectionNotes: Record<string, string>;
  motions: Motion[];
  actionItems: ActionItem[];
  decisions: Decision[];

  // Completion
  isAdjourned: boolean;
  secretarySignature: string | null; // base64 image data
  chairSignature: string | null;

  // Actions
  authenticate: (password: string, name: string) => boolean;
  advanceSection: () => void;
  goToSection: (index: number) => void;
  resetMeeting: () => void;
  // ... additional actions for each data type
}
```

### 2.3 Data Persistence

**During meeting:** All state persists to `sessionStorage` on every state change (debounced at 500ms). If the browser refreshes mid-meeting, state is restored from `sessionStorage`.

**On adjournment:** The complete meeting record is serialized to JSON. This JSON is used to generate the PDF minutes. Optionally, it can be POSTed to an API endpoint or saved to local storage for archival. For the MVP, local generation is sufficient.

**Password storage:** The session password is set by the secretary at login and exists only in memory/sessionStorage for that browser session. It is never transmitted to a server. The minutes PDF is encrypted with a separate viewer password set at adjournment.

---

## 3. AUTHENTICATION GATE

### 3.1 Landing Page (`/`)

**Full-viewport cinematic entry.**

The landing page is a single centered composition:

1. **Background:** The particle canvas is fully visible here. Slightly more particles (80-100) and slightly brighter. The radial gradients are at full intensity.
2. **Center block:** The Ohana Recovery wordmark at top (text-based, no image dependency). Below it: `"Core Organizational Planning Meeting"` in `--text-muted`. Below that: a single password input field and a "Begin Session" button.
3. **Below the input:** A small text field for "Secretary Name" (required). This name is attached to the minutes.
4. **Animation on load:** The wordmark fades in first (0-400ms), subtitle at 200ms delay, input field at 400ms delay, button at 600ms delay. Each uses `opacity: 0 -> 1` and `translateY: 12px -> 0`.

### 3.2 Password System

The password is **not hardcoded in the source code**. Instead:

- On first deployment, set the meeting password via an environment variable: `NEXT_PUBLIC_MEETING_PASSWORD` (or use a `.env.local` file).
- The landing page compares the entered password against this env var using a simple hash comparison (SHA-256 hash the input, compare to the pre-hashed env value).
- Alternatively, for simpler setups: use a `meeting-config.json` file in the project root that contains a bcrypt hash of the password. The secretary is given the plaintext password verbally or via secure message before the meeting.

**Important:** The password only controls edit access to the live meeting form. It does not protect the deployed URL itself. If needed, the URL can be further restricted via Vercel's password protection or M365 embedding with auth.

### 3.3 Emergency Reset (Hidden)

**Location:** On the landing page, triple-tap (or triple-click on desktop) the Ohana Recovery wordmark text within 1.5 seconds. This triggers a confirmation modal:

> "This will clear all meeting data and reset the session. This cannot be undone. Type RESET to confirm."

The user must type `RESET` (case-sensitive) into a text field and click confirm. This clears all sessionStorage, resets Zustand state, and returns to a fresh landing page.

**Daniel -- that's how you access the emergency reset.** Triple-click the "Ohana Recovery" title on the login screen. Type RESET. Done.

---

## 4. MEETING INTERFACE

### 4.1 Layout Structure

The meeting interface uses a persistent sidebar + main content area layout:

```
+------------------------------------------------------+
|  TOP BAR (thin, 48px)                                |
|  Meeting title | Timer | Current Section | Adjourn   |
+----------+-------------------------------------------+
| SIDEBAR  |  MAIN CONTENT AREA                        |
| (260px)  |                                           |
|          |  [Active Section Form]                    |
| Section  |                                           |
| Nav      |  Interactive fields, tables, notes        |
| List     |  for the current agenda item              |
|          |                                           |
| Status   |                                           |
| Dots     |                                           |
|          |                                           |
+----------+-------------------------------------------+
```

**Sidebar behavior:**
- Fixed position, scrollable independently
- Each section is listed as a navigation item with a status indicator:
  - `○` Empty circle = not started
  - `◑` Half circle = in progress (current)
  - `●` Filled circle in teal = completed
- Clicking a completed or current section navigates to it. Future sections are visible but dimmed and not clickable until the current section is completed or explicitly skipped by the secretary.
- At the bottom of the sidebar: a small "Meeting Info" card showing date, start time, and secretary name.

**On mobile (< 768px):** The sidebar collapses into a bottom sheet that can be swiped up. The top bar shows a hamburger/section-list toggle.

### 4.2 Top Bar

- **Left:** "Ohana Recovery" small text + meeting type badge
- **Center:** Active section timer (the circular SVG ring + digital countdown, described in Section 5)
- **Right:** "Adjourn Meeting" button (danger-styled, requires confirmation modal)

### 4.3 Main Content Area

Each agenda section renders as a distinct interactive form/card layout. The content area is scrollable. When a section is completed and the user advances, the current section slides out to the left and the new section slides in from the right (Framer Motion `AnimatePresence`).

---

## 5. SECTION TIMER SYSTEM

### 5.1 Timer Architecture

Each of the 14 agenda sections has a **recommended time allocation** (in minutes). These defaults are configurable before the meeting starts (via a settings modal accessible from the sidebar). Default allocations:

| # | Section | Default Minutes |
|---|---------|-----------------|
| 1 | Call to Order | 2 |
| 2 | Attendance | 3 |
| 3 | Adoption of Agenda | 2 |
| 4 | Current Status Reports | 10 |
| 5 | Role and Title Discussion | 12 |
| 6 | Meeting Schedule | 8 |
| 7 | Mission Statement | 10 |
| 8 | Budget and Donations | 10 |
| 9 | Website and Digital Infrastructure | 8 |
| 10 | Media, Interviews, and Outreach | 8 |
| 11 | Documents and SOPs | 8 |
| 12 | Public Representation and Access | 6 |
| 13 | Action Items | 8 |
| 14 | Adjournment | 3 |

**Total default:** ~98 minutes

### 5.2 Timer Visual

The timer is a **circular SVG ring** displayed in the top bar (64x64px) and also rendered larger (160x160px) at the top of each active section's content area.

**Visual specification:**
- Background track ring: `var(--line)` at 30% opacity, 4px stroke
- Progress ring: Gradient stroke from `var(--teal)` to `var(--purple)`, 4px stroke, rounded linecap
- The ring depletes clockwise as time passes (full = all time remaining, empty = time expired)
- Inside the ring: digital countdown in `JetBrains Mono`, showing `MM:SS`
- Below the ring (in the content area version): section name in small muted text

### 5.3 Timer States

1. **Running (normal):** Ring depletes steadily. Text is `var(--text-primary)`.
2. **Warning (20 seconds remaining):** Ring stroke transitions to `var(--orange)`. The countdown text pulses gently (opacity oscillates between 0.7 and 1.0 on a 1s cycle). **A soothing chime plays** (see Section 5.4).
3. **Expired:** Ring is empty. Stroke turns to `var(--danger)` briefly, then the section auto-highlights the "Complete Section" button with a gentle pulse. The timer does NOT auto-advance. The secretary decides when to move on.
4. **Paused:** The ring freezes. A small "PAUSED" label appears below the timer. The secretary can pause/resume via a button next to the timer.
5. **Extended:** If the secretary needs more time, they can click a "+2 min" button that adds 120 seconds to the current section timer. This button is subtle (ghost style, next to the pause button).

### 5.4 Audio Cue

**At 20 seconds remaining,** a soothing audio cue plays. This is generated using the **Web Audio API** (no external audio files needed):

```typescript
function playWarningChime() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  // Two gentle sine tones, a perfect fifth apart
  // First tone: C5 (523 Hz)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 523.25;

  // Second tone: G5 (783 Hz), slightly delayed
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 783.99;

  // Gentle gain envelope
  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.12, now + 0.08);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now + 0.15);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.23);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

  osc1.connect(gain1).connect(ctx.destination);
  osc2.connect(gain2).connect(ctx.destination);

  osc1.start(now);
  osc2.start(now + 0.15);
  osc1.stop(now + 2);
  osc2.stop(now + 2.5);
}
```

This produces a gentle, bell-like two-note chime. Not jarring. Not a buzzer. A calm nudge.

---

## 6. SECTION-BY-SECTION INTERACTIVE CONTENT

Every section below maps to one of the 14 agenda items. Each section renders as an interactive form/card layout in the main content area when that section is active.

### 6.1 Section 1: Call to Order

**Content:**
- Display the chair script in an orange-left-bordered callout card (read-only, styled like the original HTML `.script` class)
- A single button: "Call Meeting to Order" -- clicking this timestamps the `meetingStartTime` in state, starts the section timer, and activates the sidebar navigation.
- Below the script: a "Meeting Type" selector (radio buttons or segmented control): Core Check-In / Organizational Planning / Formal Board Meeting
- A "Platform" text input (default: "Zoom")

### 6.2 Section 2: Attendance

**Content:**
- A pre-populated table of known core members (Daniel Minton, Joseph Carr, Jonni Coffer, Anne Dekun) with columns:
  - Name (text, pre-filled)
  - Present (toggle switch, default off)
  - Role / Notes (text input)
- An "Add Attendee" button that appends a blank row
- Remove button (X icon) on non-core rows
- A running count at the top: "X of Y members present"

### 6.3 Section 3: Adoption of Agenda

**Content:**
- Display the full proposed agenda as a numbered list (from the Order of Business table in the original packet)
- Each item has a small "remove" or "skip" toggle if the group decides to drop an item
- An "Add Item" button to insert custom agenda items
- A text area for "Agenda Modifications / Notes"
- A "Motion to Adopt" button that records the motion with timestamp

### 6.4 Section 4: Status Reports

**Content:**
- Five collapsible sub-sections (accordion pattern):
  1. Meeting Operations
  2. Web / Technology
  3. Finance / Budget
  4. Outreach / Growth
  5. Other Updates
- Each sub-section expands to reveal a rich text area (or plain textarea) for notes
- Each has a "Reporter" text field (who gave this update)

### 6.5 Section 5: Role and Title Discussion

**Content:**
- An interactive assignment table:

| Role | Candidate | Status | Notes |
|------|-----------|--------|-------|
| Founder / Executive Lead | (text input) | (dropdown: Confirmed / Provisional / Tabled / Vacant) | (text) |
| Chair or President | ... | ... | ... |
| Secretary / Documentation Lead | ... | ... | ... |
| Treasurer / Finance Lead | ... | ... | ... |
| Meeting Operations Lead | ... | ... | ... |
| Host Coordinator | ... | ... | ... |
| Community Safety / Conduct Lead | ... | ... | ... |
| Web / Technology Lead | ... | ... | ... |
| Media / Content Lead | ... | ... | ... |
| Outreach / Partnerships Lead | ... | ... | ... |

- Pre-fill candidates from the original packet (Daniel, Joey, Jonni, Anne in their proposed areas)
- An "Add Role" button for custom roles
- A "Capture Motion" button that opens a quick-entry modal for recording a formal motion related to roles

### 6.6 Section 6: Meeting Schedule

**Content:**
- Current schedule displayed in a styled info card: "Seven days a week, 11:00 PM to 3:00 AM Pacific Time"
- Discussion points rendered as a checklist (checkable when discussed):
  - Additional time slots
  - New host approval/training process
  - Backup coverage plan
- Meeting rhythm selector (the three meeting types from the original packet with recommended frequencies)
- Notes textarea for discussion capture

### 6.7 Section 7: Mission Statement

**Content:**
- The callout from the original packet displayed at top: guidance about what the mission statement should sound like
- A large, prominent textarea labeled "Mission Statement Draft" with generous padding, larger font size (1.2rem), and a character/word counter
- Below it: a "Previous Drafts" collapsible (for iterating across meetings)
- A "Motion to Adopt Draft" button

### 6.8 Section 8: Budget and Donations

**Content:**
- The budget worksheet rendered as an editable table:

| Category | Tool / Expense | Monthly Cost | Annual Cost | Owner |
|----------|---------------|-------------|------------|-------|
| Website | Domain, hosting, etc. | $ (input) | $ (auto-calc) | (input) |
| Meetings | Zoom or equivalent | $ | $ | |
| Productivity | M365 or equivalent | $ | $ | |
| Design | Canva, Adobe, etc. | $ | $ | |
| Outreach | Flyers, ads, events | $ | $ | |
| Legal / Formation | Filing fees, legal | $ | $ | |
| Accounting | Bookkeeping, tax | $ | $ | |
| Other | Miscellaneous | $ | $ | |

- Annual cost auto-calculates as monthly * 12
- Running totals row at the bottom (sum of monthly, sum of annual)
- Below the table: Donation discussion notes textarea
- A donation-readiness checklist (checkable):
  - Donations accepted now or planned for later?
  - Who receives, tracks, and reports funds?
  - Are donations personal, project, or organizational?
  - Tax deductibility claim verified?

### 6.9 Section 9: Website and Digital Infrastructure

**Content:**
- Current site info card: "ohanarecovery.org"
- Website update priorities as a draggable priority list (drag to reorder):
  - Meeting schedule
  - Mission statement
  - Resources
  - Media
  - Contact
  - Community features
- An "Owner" and "Reviewer" field for web publishing authority
- Notes textarea

### 6.10 Section 10: Media, Interviews, and Outreach

**Content:**
- Discussion item checklist:
  - Podcast-style or interview media track
  - Member recovery story sharing (voluntary)
  - Outside guests and community figures
  - Consent, editing, publishing, and privacy expectations
- Each item expandable with a notes field
- A "Capture Decision" button for formal agreements on media policy

### 6.11 Section 11: Documents and SOPs

**Content:**
- The document priority table rendered as an interactive tracker:

| Document | Priority | Owner | Status |
|----------|----------|-------|--------|
| Mission Statement | (dropdown: High/Medium/Low) | (text) | (dropdown: Not Started/In Progress/Draft Complete/Adopted) |
| Role Descriptions | ... | ... | ... |
| Host Script | ... | ... | ... |
| Meeting SOP | ... | ... | ... |
| Budget Worksheet | ... | ... | ... |
| Donation Handling Policy | ... | ... | ... |
| Access Inventory | ... | ... | ... |
| Public Representation Policy | ... | ... | ... |
| Conflict of Interest Policy | ... | ... | ... |
| Articles / Bylaws Planning | ... | ... | ... |

- An "Add Document" button
- A callout highlighting the recommended first wave

### 6.12 Section 12: Public Representation and Access

**Content:**
- Access inventory table (editable):

| System | Owner | Backup | Access Level | Notes |
|--------|-------|--------|-------------|-------|
| Domain | (text) | (text) | (dropdown) | (text) |
| Website / Hosting | ... | ... | ... | ... |
| Email | ... | ... | ... | ... |
| Zoom | ... | ... | ... | ... |
| Microsoft 365 | ... | ... | ... | ... |
| Social Media | ... | ... | ... | ... |
| Donation Platform | ... | ... | ... | ... |

- Public representation decisions checklist:
  - Who may speak publicly for Ohana
  - Who approves public statements, posts, flyers, interviews, partnerships
  - Whether media content needs consent forms
  - Messaging alignment with mission
- Notes textarea for each

### 6.13 Section 13: Action Items

**Content:**
- A dynamic action item table with add/remove rows:

| Action Item | Owner | Due Date | Status | Priority |
|-------------|-------|----------|--------|----------|
| (text) | (text) | (date picker) | (dropdown: Open/In Progress/Complete/Tabled) | (dropdown: High/Medium/Low) |

- Pre-populated with the 12 default action items from the original packet
- "Add Action Item" button
- A closing script callout at the bottom
- A "Schedule Next Meeting" date/time picker

### 6.14 Section 14: Adjournment

**Content:**
- Meeting summary card showing:
  - Start time, current time, total duration
  - Sections completed count
  - Motions recorded count
  - Action items count
  - Attendees present count
- A "Record Adjournment Time" button that timestamps `meetingEndTime`
- **Digital Signature Capture:**
  - Two signature pads (HTML5 Canvas based):
    - "Chair Signature" with name label
    - "Secretary Signature" with name label
  - Each pad has a "Clear" button to redraw
  - The canvas captures pen/mouse/touch input and renders a smooth ink trail
  - On completion, the signature is exported as a base64 PNG and stored in state
- A "Set Minutes Password" input (this password will protect the generated PDF)
- A final "Generate and Submit Meeting Minutes" button

---

## 7. MOTIONS SYSTEM (GLOBAL)

At any point during the meeting, the secretary can record a formal motion. This is accessible via:

1. A floating action button (FAB) in the bottom-right corner of the main content area, labeled with a gavel icon
2. Section-specific "Capture Motion" buttons where relevant

**Motion entry modal:**
- Motion text (textarea)
- Moved by (text input with attendee autocomplete)
- Seconded by (text input with attendee autocomplete)
- Result (radio: Carried / Failed / Tabled / Withdrawn)
- Timestamp (auto-filled)

All motions are stored in the global state array and rendered in the final minutes.

---

## 8. PDF MINUTES GENERATION

### 8.1 Trigger

When the secretary clicks "Generate and Submit Meeting Minutes" in the Adjournment section, the application:

1. Validates that all required fields are complete (signatures, adjournment time, at least one attendee marked present)
2. Generates a PDF document from the meeting state

### 8.2 PDF Content Structure

The PDF should mirror the professional quality of the original HTML meeting packet. Dark theme (yes, the PDF should be dark-themed to match the application). Use `jsPDF` with custom rendering or `@react-pdf/renderer` for more complex layouts.

**PDF Sections:**

1. **Cover Page:**
   - Ohana Recovery header
   - "Official Meeting Minutes"
   - Meeting type, date, time, platform
   - Secretary name
   - "CONFIDENTIAL -- PASSWORD PROTECTED"

2. **Attendance Record:**
   - Table of all attendees with present/absent status and roles

3. **Agenda as Adopted:**
   - The final agenda with any modifications noted

4. **Section-by-Section Notes:**
   - For each section that has content, render the section title and captured notes/decisions

5. **Motions Record:**
   - Full table of all motions with mover, seconder, result, and timestamp

6. **Action Items:**
   - Full table with owner, due date, status, priority

7. **Budget Worksheet** (if populated)

8. **Document Priority Tracker** (if populated)

9. **Closing:**
   - Adjournment time
   - Next meeting date/time
   - Chair signature image
   - Secretary signature image
   - "These minutes were recorded using the Ohana Recovery Meeting System"

### 8.3 PDF Security

The generated PDF is password-protected using the password set by the secretary in the Adjournment section. Use `jsPDF`'s encryption options or a post-processing library.

### 8.4 Distribution

For the MVP: the PDF is downloaded to the secretary's device. A "Copy Minutes Link" button generates a shareable read-only URL (the `/minutes/[meetingId]` route) that requires the PDF password to view.

Future enhancement: email distribution via an API route (SendGrid, Resend, etc.) to all marked-present attendees who have email addresses on file.

---

## 9. SPECIAL UI COMPONENTS

### 9.1 Parallax Particle Canvas

A React component (`ParticleField`) that renders a `<canvas>` element covering the full viewport, positioned behind all content (`z-index: 0`, `position: fixed`).

Particle specs:
- 50-80 particles (fewer on mobile, detect via viewport width)
- Colors: randomly assigned from [teal, purple, orange] at 6-12% opacity
- Size: 1-2.5px radius
- Movement: Brownian drift + gentle sine wave on Y axis
- Parallax: Particles shift position based on `window.scrollY * 0.1`
- Performance: Use `requestAnimationFrame`, skip frames if tab is not visible

### 9.2 Signature Pad

A Canvas-based drawing component. Requirements:
- Smooth bezier curve interpolation between touch/mouse points (not straight lines between samples)
- Stroke width varies with speed (pressure simulation): 1.5px at fast speed, 3px at slow speed
- Stroke color: `var(--teal)`
- Background: `var(--bg-input)` with a subtle horizontal rule at 70% height (like a signature line)
- "Clear" button resets the canvas
- Export method: `toDataURL('image/png')`

### 9.3 Draggable Priority List

For the website priorities in Section 9. Use a drag-and-drop library (`@dnd-kit/core` recommended) or pure HTML Drag and Drop API.

Each item is a card with:
- Grip handle (6-dot icon on the left)
- Item name
- Position number (auto-updates on reorder)

### 9.4 Notification Toast System

Brief, non-intrusive toast notifications for:
- "Section completed" (teal accent)
- "Motion recorded" (orange accent)
- "Timer warning" (orange, at 20s remaining)
- "Meeting data saved" (muted, when sessionStorage sync fires)

Position: bottom-center, stack upward. Auto-dismiss after 3 seconds. Slide-up entrance, fade-out exit.

---

## 10. RESPONSIVE DESIGN

### 10.1 Breakpoints

- **Desktop (1024px+):** Full sidebar + content layout
- **Tablet (768-1023px):** Sidebar collapses to an icon rail (section numbers/icons only, expands on hover)
- **Mobile (< 768px):** No sidebar. Navigation via a bottom sheet or top dropdown. Timer moves inline above the content. Full-width forms.

### 10.2 Touch Optimization

- All interactive elements have minimum 44x44px touch targets
- Signature pad works with touch input (prevent page scroll when drawing)
- Drag-and-drop has touch fallback

---

## 11. FILE STRUCTURE

```
ohana-live/
├── app/
│   ├── layout.tsx              # Root layout, fonts, global styles
│   ├── page.tsx                # Landing / auth gate
│   ├── meeting/
│   │   ├── layout.tsx          # Meeting layout (sidebar + topbar)
│   │   └── page.tsx            # Meeting content router
│   └── minutes/
│       └── [meetingId]/
│           └── page.tsx        # Read-only minutes view
├── components/
│   ├── ui/                     # Generic UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Toggle.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   └── Table.tsx
│   ├── meeting/                # Meeting-specific components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── SectionTimer.tsx
│   │   ├── SectionWrapper.tsx
│   │   ├── MotionCapture.tsx
│   │   ├── SignaturePad.tsx
│   │   ├── AttendanceTable.tsx
│   │   ├── ActionItemTracker.tsx
│   │   ├── BudgetWorksheet.tsx
│   │   ├── DocumentTracker.tsx
│   │   ├── AccessInventory.tsx
│   │   ├── DraggablePriorityList.tsx
│   │   └── FloatingMotionFAB.tsx
│   ├── sections/               # One component per agenda section
│   │   ├── S01_CallToOrder.tsx
│   │   ├── S02_Attendance.tsx
│   │   ├── S03_AdoptAgenda.tsx
│   │   ├── S04_StatusReports.tsx
│   │   ├── S05_RolesAndTitles.tsx
│   │   ├── S06_MeetingSchedule.tsx
│   │   ├── S07_MissionStatement.tsx
│   │   ├── S08_BudgetDonations.tsx
│   │   ├── S09_WebsiteDigital.tsx
│   │   ├── S10_MediaOutreach.tsx
│   │   ├── S11_DocumentsSOPs.tsx
│   │   ├── S12_RepresentationAccess.tsx
│   │   ├── S13_ActionItems.tsx
│   │   └── S14_Adjournment.tsx
│   └── effects/
│       ├── ParticleField.tsx
│       ├── CompletionBurst.tsx
│       └── NoiseOverlay.tsx
├── lib/
│   ├── store.ts                # Zustand store
│   ├── timer.ts                # Timer logic
│   ├── audio.ts                # Web Audio API chime
│   ├── pdf-generator.ts        # PDF generation
│   ├── auth.ts                 # Password verification
│   └── types.ts                # TypeScript interfaces
├── public/
│   └── noise.svg               # SVG noise texture (or generate in CSS)
├── styles/
│   └── globals.css             # CSS variables, global resets, Tailwind base
├── .env.local                  # MEETING_PASSWORD_HASH
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 12. DEPENDENCY LIST

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "jspdf": "^2.5.0",
    "html2canvas": "^1.4.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "uuid": "^9.0.0",
    "bcryptjs": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "@types/uuid": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

---

## 13. BUILD AND RUN

```bash
# Initialize project
npx create-next-app@latest ohana-live --typescript --tailwind --app --src-dir=false

# Install dependencies
cd ohana-live
npm install framer-motion zustand jspdf html2canvas @dnd-kit/core @dnd-kit/sortable uuid bcryptjs
npm install -D @types/uuid @types/bcryptjs

# Set password (generate hash first)
# In a Node REPL: require('bcryptjs').hashSync('your-meeting-password', 10)
echo 'MEETING_PASSWORD_HASH=$2a$10$...' > .env.local

# Development
npm run dev

# Production build
npm run build && npm start
```

---

## 14. QUALITY CHECKLIST

Before considering the build complete, verify:

- [ ] Landing page renders with full particle animation and cinematic entry sequence
- [ ] Password authentication works and blocks unauthorized access
- [ ] Triple-click reset on the wordmark triggers the confirmation flow
- [ ] All 14 sections render with correct interactive forms
- [ ] Section timer counts down accurately with visual ring animation
- [ ] Timer chime plays at 20 seconds remaining (test audio context)
- [ ] Timer warning state (orange ring, pulsing text) activates correctly
- [ ] Sidebar navigation shows correct status indicators
- [ ] Section transitions animate smoothly (slide out/in)
- [ ] Motions can be captured from both the FAB and section-specific buttons
- [ ] Attendance table supports adding/removing rows
- [ ] Budget worksheet auto-calculates annual from monthly
- [ ] Action items table is fully editable with date pickers
- [ ] Signature pads capture smooth curves on mouse and touch
- [ ] PDF generates with all meeting data, signatures, and dark theme
- [ ] PDF is password-protected
- [ ] Session data persists through browser refresh (sessionStorage)
- [ ] Emergency reset clears all data completely
- [ ] Mobile layout is usable on a phone screen
- [ ] All animations are smooth (60fps, no jank)
- [ ] No accessibility violations on interactive elements (keyboard nav, focus states, ARIA labels)
- [ ] Toast notifications appear for key actions
- [ ] Completion particle bursts fire on section completion

---

## 15. SPIRIT OF THE BUILD

This application is for a community that meets every single night of the year, from 11 PM to 3 AM, because that is when people in recovery need someone to be there. The people using this tool are not executives. They are not board members yet. They are humans who showed up, stayed alive, and decided to build something that matters.

The design should honor that. It should feel serious without being cold. Professional without being soulless. Beautiful without being decorative. Every pixel, every transition, every interaction should say: *we built this because we give a damn, and we refuse to be mediocre.*

Ohana means family. Build it like family is watching.

---

*End of build instructions.*
