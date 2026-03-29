# UX Guardrails: Sargam Practice App

## Purpose

This document defines the minimum UX quality bar for every release.  
If a feature does not pass these checks, it should not ship.

## UX Definition of Done

- The user understands the first action within 3 seconds.
- A first-time user can reach live feedback in under 20 seconds.
- Status text does not flicker rapidly during normal singing.
- The screen has one obvious primary action at any moment.
- Visual feedback is understandable without music theory knowledge.
- Touch targets are at least 44px high on mobile.
- The app remains usable in both desktop and mobile portrait layouts.

## Core UX Principles

- Keep language plain and encouraging: `Low`, `On Pitch`, `High`, `Hold a steady note`.
- Prefer guided flow over options overload.
- Show immediate feedback, but avoid noisy state bouncing.
- Maintain continuity during short pitch dropouts.
- Never block manual control; auto helpers should always be overridable.

## Canonical UI States

- `idle`: app loaded, mic not active.
- `listening`: mic active, waiting for stable voice.
- `tracking`: stable pitch detected, showing swara and meter.
- `calibrating`: finding suggested Sa.
- `drill`: guided target swara mode active.
- `mic_blocked`: microphone unavailable or denied.

All new features should map to one of these states and should not invent ad-hoc status behavior.

## Copy and Feedback Rules

- Use short messages under 60 characters where possible.
- Do not switch status text more frequently than needed.
- Keep success language positive and specific.
- Use warning language as guidance, not error blame.

Approved baseline messages:

- `Press Start or Find My Sa to begin.`
- `Mic active. Start singing.`
- `Finding Sa. Sing one comfortable steady note.`
- `Hold a steady note...`
- `Drill: sing <Swara> and hold in tune.`
- `Drill complete. Great job.`

## Performance and Stability Targets

- Pitch display should update smoothly in real time under normal conditions.
- UI should tolerate short detector misses without full reset.
- Prolonged silence should reset cleanly to listening state.
- Reference note playback should not stack into noisy overlap.

## Accessibility and Layout Checks

- Primary controls must remain visible without scrolling on common phone heights.
- Text contrast must remain readable in daylight conditions.
- Buttons must be keyboard-focusable.
- Important status info should not rely on color alone.

## Manual QA Script Before Release

1. Fresh load test: can a new user start in under 20 seconds?
2. Permission test: deny mic once, then allow mic; check clear recovery.
3. Quiet singing test: soft voice still triggers stable feedback.
4. Loud singing test: meter remains readable and controlled.
5. Flicker test: no rapid `Listening/Detecting` thrash while singing.
6. Sa helper test: `Find My Sa` and `Use Current as Sa` both produce expected base.
7. Drill test: all steps advance only after in-tune hold.
8. Mobile test: controls and meter remain usable in portrait mode.

## Change Gate

Before merging any UX-impacting change:

- Update this file if the behavior model changes.
- Run the manual QA script.
- Note any known limitation in the PR/commit message.
