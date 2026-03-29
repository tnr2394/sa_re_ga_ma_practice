# D1 Wireframes: Practice Coach Direction

## 1. Scope

This wireframe set is low-fidelity and mobile-first.  
It covers the core states defined in `DESIGN_STRATEGY.md`:

- First session onboarding
- Free Sing
- Guided Drill
- 60s Challenge
- Session Summary

## 2. Layout Rules (Applied to All Screens)

- Keep one primary action visible above fold.
- Pitch area stays central and visually dominant.
- Controls appear in progressive disclosure, not all at once.
- Status copy is one line only.

Shared top structure:

```text
---------------------------------------
SARGAM PRACTICE
<short contextual subtitle>
---------------------------------------
```

Shared mid structure:

```text
[Mode Segment: Free | Drill | 60s]
[Status line]
[Swara + Feedback]
[Pitch Meter]
```

Shared bottom structure:

```text
[Context panel for current mode]
[Reference notes row]
```

## 3. Screen A: First Session Onboarding

Goal: get user to first meaningful pitch feedback in under 20s.

```text
---------------------------------------
SARGAM PRACTICE
Start in 3 quick steps

[ Step 1: Allow Mic ]  (Primary)
[ Step 2: Find My Sa ] (disabled until step 1)
[ Step 3: Start 60s ]  (disabled until step 2)

Status: Press Allow Mic

(collapsed advanced controls)
  [Show Advanced]
---------------------------------------
```

Behavior notes:

- Hide non-essential controls during first-run steps.
- After step 3 completion, set onboarding as complete.
- Returning users skip this screen and land in Free Sing.

## 4. Screen B: Free Sing (Default Daily Mode)

Goal: quick, calm, always-available practice.

```text
---------------------------------------
SARGAM PRACTICE
Free Sing

[ Free | Drill | 60s ]  <- Free active

Status: Mic active. Start singing.
Swara: GA
Feedback: On Pitch

        [ vertical meter ]
         Low        High

[ Start Listening ] (Primary)
[ Find My Sa ] [ Use Current as Sa ]

[ Base Sa selector ] [ Difficulty selector ]

Coach: Keep your breath steady.

Reference Notes:
[Sa][Re][Ga][Ma][Pa][Dha][Ni]
---------------------------------------
```

Behavior notes:

- One primary CTA: Start/Stop Listening.
- Sa + difficulty stay visible but secondary.
- Coach line only one sentence.

## 5. Screen C: Guided Drill

Goal: structured note-by-note learning with visible progression.

```text
---------------------------------------
SARGAM PRACTICE
Guided Drill

[ Free | Drill | 60s ] <- Drill active

Status: Sing RE and hold in tune
Target: RE             Step 2 / 7

[ hold progress bar ----------- ]

Swara: RE
Feedback: Slightly High

        [ vertical meter ]

[ Start Drill ] / [ Stop Drill ] (Primary)

Coach: Relax slightly and come down.

Reference Notes:
[Sa][Re][Ga][Ma][Pa][Dha][Ni]
---------------------------------------
```

Behavior notes:

- Drill panel appears only in Drill mode.
- Advance only after in-tune hold threshold.
- Reference note auto-plays on each target transition.

## 6. Screen D: 60s Challenge

Goal: fun, repeatable practice loop with light gamification.

```text
---------------------------------------
SARGAM PRACTICE
60s Challenge

[ Free | Drill | 60s ] <- 60s active

Status: Hit MA and hold
Time Left: 00:38
Target: MA

[ challenge progress bar ------- ]

Swara: MA
Feedback: On Pitch

        [ vertical meter ]

[ Start Challenge ] / [ Stop Challenge ] (Primary)

Stats: [Stars 8] [Streak 3] [Time 00:22]
Coach: Great control. Keep it steady.
---------------------------------------
```

Behavior notes:

- Keep stats compact in one row.
- No extra cards while active challenge is running.
- Avoid status flicker; update with intent, not noise.

## 7. Screen E: Session Summary

Goal: short closure + motivation to repeat.

```text
---------------------------------------
Session Complete

Mode: 60s Challenge
Stars: 12
Best Streak: 4
Time: 01:00

Coach Insight:
"You were often high on Re. Relax and come down slightly."

[ Practice Again ] (Primary)
[ Switch Mode ]
---------------------------------------
```

Behavior notes:

- Keep summary concise and actionable.
- Show only one insight, not a long report.
- Auto-dismiss after a few seconds unless user interacts.

## 8. Component Visibility Matrix

| Component | Free | Drill | 60s | Summary |
|---|---|---|---|---|
| Mode segment | Yes | Yes | Yes | No |
| Start/Stop listening | Yes | Optional | Optional | No |
| Drill target panel | No | Yes | No | No |
| Challenge target panel | No | No | Yes | No |
| Stats strip | Optional | Yes | Yes | In summary |
| Summary card | No | End only | End only | Yes |

## 9. Content Priority by State

- Onboarding: actions > explanation
- Free: live feedback > controls
- Drill: target/hold > meter > controls
- Challenge: timer/target > meter > stats
- Summary: result > insight > next action

## 10. Open Questions for D2

- Should Free mode always show stats strip, or only after a timed mode starts?
- Should reference notes stay pinned in all modes, or collapse behind a button in challenge?
- Should Start Listening be implicit when entering Drill/Challenge, or explicit?

## 11. Handoff Note

This D1 defines structure and flow only.  
Visual treatment (colors, typography scale, spacing tokens, and component states) is defined in `D2` next.
