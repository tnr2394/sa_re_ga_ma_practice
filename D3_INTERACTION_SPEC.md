# D3 Interaction Spec: Practice Coach

## 1. Purpose

This document defines state transitions, interactions, and behavior rules for v1 implementation.

It prevents mixed-state behavior and UI drift by making transitions explicit.

## 2. State Model

Primary app states:

- `idle`
- `listening`
- `tracking`
- `calibrating_sa`
- `drill_active`
- `challenge_active`
- `summary_visible`
- `mic_blocked`

Only one primary state should be dominant at a time.

## 3. Entry Conditions

- App load:
  - if first run: show onboarding path inside `idle`
  - otherwise: show `idle` with saved settings

- `listening` starts when microphone is granted and stream is active.
- `tracking` starts when stable pitch frames are detected.
- `calibrating_sa` starts only from `idle/listening/tracking`.
- `drill_active` and `challenge_active` require mic availability.

## 4. Exit Conditions

- `calibrating_sa` exits after timer completion or explicit cancel.
- `drill_active` exits on completion, stop action, or mode change.
- `challenge_active` exits on timer end, stop action, or mode change.
- `tracking` falls back to `listening` after sustained no-voice/no-pitch timeout.
- `mic_blocked` exits only when permission is granted after retry.

## 5. Transition Table

| From | Event | To | Notes |
|---|---|---|---|
| idle | Tap Start Listening + mic granted | listening | Start stream/analyzer |
| idle | Tap Start Listening + mic denied | mic_blocked | Show recovery message |
| listening | Stable pitch detected | tracking | Update swara/meter |
| tracking | Voice absent over timeout | listening | Keep no-flicker grace |
| listening/tracking | Tap Find My Sa | calibrating_sa | Pause drill/challenge if active |
| calibrating_sa | Successful detection | listening | Set Sa + feedback |
| calibrating_sa | Unclear detection | listening | Show retry guidance |
| idle/listening/tracking | Tap Drill Start | drill_active | Set drill target step 1 |
| drill_active | Hold target threshold met | drill_active | Advance step |
| drill_active | Last step complete | summary_visible | Show drill summary |
| drill_active | Tap Stop / mode switch | summary_visible | Stop and summarize |
| idle/listening/tracking | Tap Challenge Start | challenge_active | Start timer + target loop |
| challenge_active | Time reaches 0 | summary_visible | Show challenge summary |
| challenge_active | Tap Stop / mode switch | summary_visible | Stop and summarize |
| summary_visible | Auto-dismiss timeout | listening or idle | Depends on mic state |

## 6. Mode Interaction Rules

Modes:

- `free`
- `drill`
- `challenge`

Rules:

- Switching mode must stop incompatible active runs.
- `drill` and `challenge` are mutually exclusive.
- Free mode can coexist with listening/tracking.
- Mode switch should preserve saved settings but reset mode-specific progress.

## 7. Onboarding Interaction Rules

Steps:

1. Allow Mic
2. Find My Sa
3. Start 60s Challenge

Rules:

- Steps unlock in order.
- Completed step should get visual confirmation.
- Onboarding completion persists in local settings.
- Returning users skip onboarding panel by default.

## 8. Timing and Threshold Rules

- Pitch on-target threshold comes from selected difficulty.
- Drill hold threshold comes from selected difficulty.
- Challenge hold threshold is slightly lower than drill threshold.
- Use grace windows for no-pitch/no-voice to avoid status flicker.
- Summary auto-dismiss delay: around 8-10 seconds unless user interacts.

## 9. Feedback Rules

- On pitch:
  - meter indicator = success color
  - optional stability glow after hold threshold

- High/Low:
  - warning color + directional message

- Off-target:
  - error color

- No pitch:
  - non-punitive helper copy (`Hold a steady note...`)

## 10. Coach Tip Rules

- Coach tip updates from aggregated trend stats (high/low tendencies).
- Show max one suggestion sentence.
- During active mode: keep tip stable; avoid rapid text changes.
- After summary: update to top issue insight or positive reinforcement.

## 11. Primary CTA Rules

Each dominant state has exactly one primary CTA:

- idle: `Start Listening`
- calibrating_sa: none (process running)
- drill_active: `Stop Drill`
- challenge_active: `Stop Challenge`
- summary_visible: `Practice Again`

Secondary controls stay available but visually lower weight.

## 12. Persistence Rules (Local Storage)

Persist:

- selected Sa
- difficulty
- reference duration
- preferred mode
- onboarding complete flag

Do not persist:

- temporary session score/streak state
- active drill/challenge runtime status

## 13. Error and Recovery

### 13.1 Mic blocked

- Show clear one-line instruction to allow mic.
- Keep `Start Listening` available for retry.

### 13.2 Pitch engine unavailable

- Show clear message (`Pitch engine could not load...`).
- Keep app navigable; disable active pitch actions until retry/reload.

### 13.3 Noisy environment

- Show helper guidance rather than error tone.
- Preserve recent feedback briefly before resetting.

## 14. Anti-Flicker Requirements

- Avoid alternating `Listening/Detecting` frame-to-frame.
- Debounce or grace-window status transitions.
- Update status text by state intent, not every detector fluctuation.

## 15. Metrics (Behavioral Success)

- First-time to meaningful feedback: <20s median.
- Returning user to meaningful feedback: <10s median.
- Fewer manual retries for Sa selection over time.
- Higher completion rate of 60s challenge.

## 16. Test Scenarios for D3

1. First run complete path (all 3 onboarding steps).
2. Mic deny then allow recovery.
3. Start drill -> mode switch to challenge.
4. Start challenge -> Sa change mid-run.
5. Quiet voice detection stability.
6. Summary auto-dismiss and re-entry behavior.
7. Persistence across refresh and reopen.

## 17. Implementation Constraint

No new behavior should be added without mapping to:

- a primary state
- a transition trigger
- an exit condition

If not mappable, it should not be implemented.
