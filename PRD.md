# PRD: Sargam Practice Web App (V1)

## 1. Product Summary

The Sargam Practice Web App is a browser-based singing aid for beginners and casual singers. It listens to the user's voice through the microphone, detects the current pitch in real time, maps that pitch to the nearest swara relative to a chosen `Sa`, and gives simple feedback such as `Low`, `On Pitch`, or `High`.

The product is designed to feel approachable and non-technical. It should help users practice basic sargam and pitch matching without requiring formal music training.

## 2. Problem Statement

Beginner singers often struggle to know whether they are singing the correct note or how far off they are. Existing tuner-style tools can feel too technical, while music learning apps may be too complex for someone who just wants simple guidance while practicing.

This app solves that gap by providing:

- a user-selected or default `Sa`
- live pitch detection
- simple swara-based feedback
- optional reference-note playback

## 3. Target Users

- Beginner singers learning basic sargam
- Casual karaoke users who want pitch guidance
- Users practicing alone without a teacher present
- Users who need intuitive, visual feedback rather than music-theory-heavy instruction

## 4. Product Goals

- Help users match and hold basic swaras more accurately
- Make singing practice easy to start in the browser
- Provide real-time feedback that is simple enough for beginners
- Build a lightweight V1 that proves the live pitch experience before adding exercises or deeper training features

## 5. Non-Goals for V1

- Full guided lessons or structured courses
- Detailed classical training features
- Komal and teevra swara support
- Practice history, gamification, or scoring dashboards
- Teacher mode or custom lesson authoring
- Background tanpura or accompaniment
- Advanced pitch analytics exposed to the user

## 6. V1 Scope

### In Scope

- Browser-based HTML app usable on desktop and mobile browsers
- Default `Sa` so a user can start quickly
- Manual `Sa` selection so the user can match their comfortable singing range
- Microphone permission flow and listening status
- Real-time pitch detection from live singing
- Mapping detected pitch to the nearest swara relative to the selected `Sa`
- Simple feedback labels:
  - `Low`
  - `On Pitch`
  - `High`
- Clear display of the nearest swara
- Simple indication of note stability while holding a note
- Reference-note buttons to play clean swaras on demand

### Out of Scope

- Guided exercises like alankars
- Multi-session progress tracking
- Account system or cloud sync
- Background drone
- Automatic recommendation of ideal `Sa`
- Detailed cent values shown as the primary UX

## 7. Core User Flow

1. User opens the app.
2. App shows a default `Sa`.
3. User either keeps the default `Sa` or changes it.
4. User grants microphone access.
5. App confirms that it is listening.
6. User sings a note.
7. App shows the nearest swara and whether the pitch is low, on pitch, or high.
8. User optionally taps a swara button to hear a reference tone and retries.

## 8. User Stories

- As a user, I want the app to start with a default `Sa` so I can begin immediately.
- As a user, I want to change `Sa` manually so the app matches my vocal comfort.
- As a user, I want to know when the microphone is active so I feel confident the app is listening.
- As a user, I want the app to detect my pitch live while I sing.
- As a user, I want to see which swara I am closest to in real time.
- As a user, I want simple feedback telling me if I am low, on pitch, or high.
- As a user, I want a visual guide that helps me correct my pitch quickly.
- As a user, I want to know if my held note is stable or shaky.
- As a user, I want to hear a clean reference note when I need help finding the pitch.
- As a user, I want the app to feel simple and friendly instead of technical and intimidating.
- As a user, I want the app to work on my phone or laptop without installing anything.

## 9. Functional Requirements

### 9.1 Sa Selection

- The app must load with a default `Sa`.
- The app must allow the user to change `Sa` manually.
- The selected `Sa` must be used as the tonic reference for swara mapping.

### 9.2 Microphone and Audio Input

- The app must request microphone permission in-browser.
- The app must clearly show whether microphone access is granted, denied, or inactive.
- The app must process live voice input with low enough latency for real-time feedback.

### 9.3 Pitch Detection

- The app must detect the user's current sung pitch while the user is vocalizing.
- The app should ignore silence and reduce noisy or unstable detections where possible.
- The app must continuously update feedback during singing.

### 9.4 Swara Mapping

- The app must map detected pitch to the nearest swara based on the selected `Sa`.
- V1 must use 12-TET (Equal Temperament) for all swara mapping and reference playback.
- V1 should support basic shuddh sargam mapping:
  - `Sa`
  - `Re`
  - `Ga`
  - `Ma`
  - `Pa`
  - `Dha`
  - `Ni`
- The app should show the nearest swara as the main pitch label.
- Swara offsets for V1 should use ET semitone steps: `0, 2, 4, 5, 7, 9, 11`.

### 9.5 Feedback

- The app must show whether the user is `Low`, `On Pitch`, or `High`.
- V1 thresholds must be:
  - `On Pitch`: within +/-15 cents
  - `Low/High`: 16 to 50 cents away from target
  - `Off-target`: beyond 50 cents (still snap to nearest swara label)
- The app should present feedback in a simple visual format such as a needle, bar, or moving dot.
- The app should indicate whether a sustained note is steady or unstable.
- Stability reward should trigger after 1.5 seconds continuously in the `On Pitch` range.
- The UX should avoid exposing technical metrics unless needed for debugging or a future advanced mode.

### 9.6 Reference Notes

- The app must provide buttons for swara reference playback.
- When a user taps a swara button, the app must play a clean target tone based on the current `Sa`.
- Reference playback should be optional and not interrupt the main live feedback flow.

## 10. UX Requirements

- The interface must be simple enough for a first-time user to understand without instructions.
- The main screen should prioritize:
  - selected `Sa`
  - microphone state
  - current swara
  - pitch feedback
  - reference-note controls
- Feedback language should be encouraging and easy to understand.
- The design should avoid clutter, excessive numbers, and theory-heavy labels.
- The app should be usable in portrait mobile layout as well as desktop layout.
- The pitch UI should use a vertical meter with a centered target zone.

## 11. Success Criteria for V1

The V1 release is successful if:

- a beginner can open the app and start using it without explanation
- live pitch detection feels responsive enough to guide practice
- users can understand whether they are near the intended swara
- reference notes help users self-correct
- the app is stable enough to support short practice sessions in the browser

## 12. Risks and Constraints

- Browser microphone permissions may create onboarding friction.
- Pitch detection accuracy can vary based on device quality and background noise.
- Beginners may become confused if feedback is too jumpy or too technical.
- A poor default `Sa` may not suit all users, so manual adjustment must be easy.

## 13. Future Enhancements

- Guided sargam exercises
- Ascending and descending patterns
- Alankars
- Practice summaries and history
- Score or streak system
- Komal and teevra support
- Tanpura or drone background
- Suggested `Sa` based on detected vocal range
- Teacher or coach mode

## 14. Resolved Product Decisions

- Default `Sa`: `C#4` (`277.18 Hz`) in Equal Temperament
- Pitch indicator: vertical meter with center target
- Pitch thresholds:
  - `On Pitch`: +/-15 cents (green)
  - `Low/High`: 16 to 50 cents (yellow)
  - `Off-target`: beyond 50 cents, while still snapping label to nearest swara
- Stability feedback: visual glow when user remains on pitch for more than 1.5 seconds
- Technical stack: Vanilla HTML/CSS/JS, Web Audio API, YIN pitch detector (`pitchfinder`)
- Frequency math: 12-TET semitone mapping for shuddh swaras (`0, 2, 4, 5, 7, 9, 11`)

## 15. Recommended V1 Positioning

This product should be positioned as a simple browser practice tool for basic pitch matching and sargam familiarity, not as a full classical music training platform. That keeps the scope realistic, the UX clean, and the first build focused on the feature that matters most: trustworthy live feedback.
