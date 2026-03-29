# Design Strategy: Sargam Practice App

## 1. Why This Exists

We are pausing feature coding and moving to a design-first process.

The current app works functionally, but the visual and interaction system is not yet cohesive or delightful.  
This document defines how we decide what "good design" means for this product before further UI implementation.

## 2. Product Design North Star

The app should feel like:

- `easy to start in under 20 seconds`
- `calm and confidence-building while singing`
- `playful enough to motivate repeat practice`
- `clear enough for a first-time beginner`

If a design choice improves looks but increases cognitive load, it should be rejected.

## 3. Design Goals

- Reduce first-use anxiety.
- Make one primary action obvious at every step.
- Keep pitch feedback readable at a glance while singing.
- Use visual hierarchy that matches the user journey.
- Add delight through controlled motion and rewards, not clutter.

## 4. Anti-Goals

- Dashboard-style crowding of too many controls at once.
- Bright "game UI" overload that competes with pitch feedback.
- Too many boxes/cards with equal visual weight.
- Text-heavy instructions users must read before singing.

## 5. Primary Users and Context

- Beginner learning basic sargam.
- Casual karaoke user wanting quick tuning.
- User practicing in short bursts on phone.

Typical context:

- Holding phone in one hand.
- Room noise is variable.
- User attention is mostly on their own voice, not detailed text.

## 6. Core Journeys We Must Design For

### Journey A: First Session (critical)

1. Open app
2. Allow mic
3. Find/set Sa
4. Start practice mode
5. Receive immediate understandable feedback

Success condition:

- User reaches meaningful singing feedback without confusion.

### Journey B: Daily Quick Practice

1. Open app
2. Resume saved settings
3. Start preferred mode immediately

Success condition:

- Time to first note feedback under 10 seconds for returning users.

### Journey C: Fun Session

1. Start challenge mode
2. Receive targets, stars, and simple coach nudges
3. End with short summary

Success condition:

- User feels motivated to repeat.

## 7. Information Hierarchy (Single-Screen)

Visual priority order:

1. `Current practice intent` (mode + target)
2. `Live pitch result` (swara + low/on/high)
3. `Primary CTA` (start/stop mode)
4. `Sa + difficulty controls`
5. `Secondary helpers` (Find Sa, reference notes)
6. `Stats and summary`

Rule:

- If two elements look equally important, hierarchy is wrong.

## 8. Interaction Model (State-First Design)

We keep one dominant state at a time:

- `Idle`
- `Listening`
- `Tracking`
- `Calibrating Sa`
- `Guided Drill`
- `Challenge`
- `Summary`

Each state defines:

- one primary CTA label
- one status line
- one focal visual area

No mixed-state screens.

## 9. Copy Tone System

Copy must be:

- short
- directive
- supportive

Examples:

- `Sing a steady note`
- `Great, now hold it`
- `A little high`
- `Nice control`

Avoid:

- technical diagnostics by default
- long sentence instructions
- judgmental language

## 10. Visual Design Directions (Choose One)

### Direction A: Calm Studio

- Soft neutral background
- Deep blue + mint accents
- Minimal gradients
- Clean, sparse cards

Pros:

- Trustworthy and focused

Risk:

- May feel less fun

### Direction B: Practice Coach (recommended)

- Warm paper-like base + cool feedback accents
- Clear, chunky controls
- Gentle reward animations
- Friendly typography with strong hierarchy

Pros:

- Balanced clarity + motivation

Risk:

- Needs careful restraint to avoid visual noise

### Direction C: Karaoke Pulse

- Strong contrast and energetic colors
- Bold progress and gamified visuals

Pros:

- High excitement

Risk:

- Can become tiring for daily riyaaz users

## 11. Recommended Direction

Choose `Direction B: Practice Coach`.

Reason:

- Best fit for beginners who need calm clarity plus motivation.
- Supports both serious practice and casual usage.

## 12. Component Design Rules

- `Primary button`: highest contrast, only one per state.
- `Secondary buttons`: lower contrast and grouped.
- `Mode selector`: segmented control, clearly active state.
- `Pitch meter`: always central and visually dominant.
- `Status line`: one concise sentence.
- `Summary card`: auto-dismiss or collapsible.

## 13. Mobile-First Layout Rules

- Keep primary action visible above fold on common phone heights.
- Minimum tap target 44px.
- Avoid forcing all control groups to stack too early.
- Preserve 2-3 column micro-layout where readability allows.

## 14. Motion and Feedback Rules

- Use subtle entrance and progress motion.
- Reward moments:
  - on-pitch hold glow
  - step completion pulse
  - challenge completion micro-celebration

No constant pulsing or competing animations.

## 15. Design QA Checklist

- Can a new user start in <20s without instructions?
- Is there exactly one obvious next action?
- Does the meter remain the visual focal point?
- Are status and feedback readable instantly?
- Does the screen feel calm during singing?
- Is challenge mode motivating without clutter?

## 16. Design-First Workflow (Mandatory)

Before coding new UI:

1. Finalize chosen visual direction.
2. Produce low-fi wireframes for all core states.
3. Produce one high-fi screen per state.
4. Run quick visual critique against this strategy.
5. Implement only after sign-off.

## 17. Immediate Next Deliverables

- `D1`: Wireframe set (first-session, free sing, drill, challenge, summary)
- `D2`: Mini style guide (type scale, color tokens, spacing scale, component states)
- `D3`: Interaction spec (state transitions + CTA labels)

No additional visual coding until D1-D3 are approved.
