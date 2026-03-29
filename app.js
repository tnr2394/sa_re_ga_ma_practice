let YIN = null;
let pitchfinderReady = false;
const pitchfinderReadyPromise = import("https://esm.sh/pitchfinder@2.3.0")
  .then((module) => {
    YIN = module.YIN;
    pitchfinderReady = true;
  })
  .catch((error) => {
    console.error(error);
  });

    const SHUDDH_SWARAS = [
      { name: "Sa", offset: 0 },
      { name: "Re", offset: 2 },
      { name: "Ga", offset: 4 },
      { name: "Ma", offset: 5 },
      { name: "Pa", offset: 7 },
      { name: "Dha", offset: 9 },
      { name: "Ni", offset: 11 }
    ];
    const DRILL_SEQUENCE = [...SHUDDH_SWARAS];

    const DIFFICULTY_PRESETS = {
      easy: {
        onPitchCents: 22,
        holdMs: 700
      },
      normal: {
        onPitchCents: 15,
        holdMs: 900
      }
    };

    const STORAGE_KEY = "sargam_practice_settings_v2";
    const DEFAULT_SETTINGS = {
      saValue: "",
      difficulty: "normal",
      referenceDurationSec: 4.5,
      activeMode: "free",
      onboarded: false
    };

    const WARN_CENTS = 50;
    const STABILITY_THRESHOLD_MS = 1500;
    const DRILL_STEP_GAP_MS = 240;
    const CHALLENGE_DURATION_MS = 60000;
    const CHALLENGE_STEP_GAP_MS = 190;
    const VOICE_ON_GATE = 0.0045;
    const VOICE_OFF_GATE = 0.0032;
    const VOICE_HANGOVER_MS = 280;
    const SMOOTHING_WINDOW = 5;
    const REFERENCE_ATTACK_SEC = 0.03;
    const REFERENCE_RELEASE_SEC = 0.2;
    const REFERENCE_LEVEL = 0.24;
    const NO_PITCH_GRACE_MS = 550;
    const SILENCE_RESET_MS = 900;
    const CALIBRATION_MS = 2400;
    const CALIBRATION_MIN_SAMPLES = 18;
    const CALIBRATION_MIN_HZ = 70;
    const CALIBRATION_MAX_HZ = 900;
    const SA_MIDI_MIN = 45; // A2
    const SA_MIDI_MAX = 72; // C5
    const DEFAULT_SA_NOTE = "C#4";
    const TREND_RECORD_INTERVAL_MS = 260;

    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const INDIAN_KEYS = {
      "C4": "Safed 1",
      "C#4": "Kali 1",
      "D4": "Safed 2",
      "D#4": "Kali 2",
      "E4": "Safed 3",
      "F4": "Safed 4",
      "F#4": "Kali 3",
      "G4": "Safed 5",
      "G#4": "Kali 4",
      "A4": "Safed 6",
      "A#4": "Kali 5",
      "B4": "Safed 7"
    };

    let settings = loadSettings();

    let audioContext = null;
    let analyser = null;
    let detectPitch = null;
    let isListening = false;
    let baseSaFreq = 277.18;
    let onPitchCents = DIFFICULTY_PRESETS.normal.onPitchCents;
    let holdMs = DIFFICULTY_PRESETS.normal.holdMs;
    let referenceDurationSec = DEFAULT_SETTINGS.referenceDurationSec;
    let activeMode = "free";
    let onPitchStartTime = null;
    let rafId = null;
    let isSaCalibrating = false;
    let calibrationStartTime = 0;
    let calibrationSamples = [];
    let recentFrequencies = [];
    let lastStableFrequency = null;
    let activeReference = null;
    let lastPitchAt = 0;
    let lastVoiceAt = 0;
    let isVoiceActive = false;
    let isDrillActive = false;
    let drillStepIndex = 0;
    let drillHoldStartAt = 0;
    let drillStepLockUntil = 0;
    let isChallengeActive = false;
    let challengeStepIndex = 0;
    let challengeHoldStartAt = 0;
    let challengeStepLockUntil = 0;
    let challengeEndsAt = 0;
    let sessionStars = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let sessionStartAt = 0;
    let sessionElapsedMs = 0;
    let isSessionActive = false;
    let sessionMode = "Free Sing";
    let lastTrendRecordAt = 0;
    let trendStats = emptyTrendStats();
    let summaryHideTimer = null;
    let quickSteps = {
      mic: false,
      sa: false,
      challenge: false
    };
    let saOptions = [];
    const saOptionsByValue = new Map();

    const micBtn = document.getElementById("mic-btn");
    const findSaBtn = document.getElementById("find-sa-btn");
    const setCurrentSaBtn = document.getElementById("set-current-sa-btn");
    const difficultySelect = document.getElementById("difficulty-select");
    const referenceDurationInput = document.getElementById("ref-duration");
    const referenceDurationValue = document.getElementById("ref-duration-value");
    const saSelect = document.getElementById("sa-select");
    const modeButtons = document.querySelectorAll(".mode-btn");
    const modePill = document.getElementById("mode-pill");
    const tipLine = document.getElementById("tip-line");
    const statusLine = document.getElementById("status-line");
    const swaraLabel = document.getElementById("swara-label");
    const feedbackLabel = document.getElementById("feedback-label");
    const meterIndicator = document.getElementById("meter-indicator");
    const meterTarget = document.getElementById("meter-target");
    const quickStartPanel = document.getElementById("quickstart-panel");
    const quickStartNote = document.getElementById("quickstart-note");
    const quickMicBtn = document.getElementById("qs-mic-btn");
    const quickSaBtn = document.getElementById("qs-sa-btn");
    const quickChallengeBtn = document.getElementById("qs-challenge-btn");
    const drillPanel = document.getElementById("drill-panel");
    const referenceButtons = document.querySelectorAll(".note-btn");
    const drillBtn = document.getElementById("drill-btn");
    const drillTarget = document.getElementById("drill-target");
    const drillProgress = document.getElementById("drill-progress");
    const drillFill = document.getElementById("drill-fill");
    const challengePanel = document.getElementById("challenge-panel");
    const challengeBtn = document.getElementById("challenge-btn");
    const challengeTarget = document.getElementById("challenge-target");
    const challengeTime = document.getElementById("challenge-time");
    const challengeFill = document.getElementById("challenge-fill");
    const starsPill = document.getElementById("stars-pill");
    const streakPill = document.getElementById("streak-pill");
    const timePill = document.getElementById("time-pill");
    const coachTip = document.getElementById("coach-tip");
    const summaryPanel = document.getElementById("summary-panel");
    const summaryTitle = document.getElementById("summary-title");
    const summaryBody = document.getElementById("summary-body");
    const pageBody = document.body;

    function midiToFrequency(midi) {
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function midiToNoteName(midi) {
      const noteName = NOTE_NAMES[midi % 12];
      const octave = Math.floor(midi / 12) - 1;
      return `${noteName}${octave}`;
    }

    function formatSaLabel(noteName, frequency) {
      const alias = INDIAN_KEYS[noteName];
      if (alias) {
        return `${noteName} (${alias}) - ${frequency.toFixed(2)} Hz`;
      }
      return `${noteName} - ${frequency.toFixed(2)} Hz`;
    }

    function loadSettings() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return {
          ...DEFAULT_SETTINGS,
          ...parsed
        };
      } catch {
        return { ...DEFAULT_SETTINGS };
      }
    }

    function persistSettings() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function populateSaOptions() {
      saSelect.innerHTML = "";
      saOptions = [];
      saOptionsByValue.clear();

      for (let midi = SA_MIDI_MIN; midi <= SA_MIDI_MAX; midi += 1) {
        const frequency = midiToFrequency(midi);
        const noteName = midiToNoteName(midi);
        const value = frequency.toFixed(4);
        const option = {
          value,
          noteName,
          frequency,
          label: formatSaLabel(noteName, frequency)
        };
        saOptions.push(option);
        saOptionsByValue.set(value, option);

        const optionEl = document.createElement("option");
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        if (noteName === DEFAULT_SA_NOTE) {
          optionEl.selected = true;
        }
        saSelect.appendChild(optionEl);
      }

      const fallbackValue = [...saOptionsByValue.values()].find((item) => item.noteName === DEFAULT_SA_NOTE)?.value || saOptions[0].value;
      const preferred = settings.saValue && saOptionsByValue.has(settings.saValue) ? settings.saValue : fallbackValue;
      saSelect.value = preferred;
      const selected = saOptionsByValue.get(preferred);
      if (selected) {
        baseSaFreq = selected.frequency;
      }
    }

    function getSelectedSaOption() {
      return saOptionsByValue.get(saSelect.value) || saOptions[0];
    }

    function centsBetween(frequencyA, frequencyB) {
      return 1200 * Math.log2(frequencyA / frequencyB);
    }

    function nearestSaOption(targetFrequency) {
      let best = saOptions[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const option of saOptions) {
        const distance = Math.abs(centsBetween(targetFrequency, option.frequency));
        if (distance < bestDistance) {
          best = option;
          bestDistance = distance;
        }
      }

      return best;
    }

    function trimmedMedian(values) {
      if (!values.length) {
        return null;
      }
      const sorted = [...values].sort((a, b) => a - b);
      const trimCount = Math.floor(sorted.length * 0.2);
      const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
      const sample = trimmed.length >= 3 ? trimmed : sorted;
      const middle = Math.floor(sample.length / 2);
      if (sample.length % 2 === 0) {
        return (sample[middle - 1] + sample[middle]) / 2;
      }
      return sample[middle];
    }

    function median(values) {
      if (!values.length) {
        return null;
      }
      const sorted = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
      }
      return sorted[middle];
    }

    function setStatus(text) {
      statusLine.textContent = text;
    }

    function setSwaraLabel(noteText, hasNote) {
      swaraLabel.textContent = noteText;
      swaraLabel.classList.toggle("has-note", hasNote);
    }

    function setTipLine(text) {
      tipLine.textContent = text;
    }

    function modeLabelText(mode) {
      if (mode === "drill") {
        return "Guided Drill Mode";
      }
      if (mode === "challenge") {
        return "60s Challenge Mode";
      }
      return "Free Sing Mode";
    }

    function updateModePill() {
      modePill.textContent = modeLabelText(activeMode);
    }

    function syncControlState() {
      const isStructuredModeActive = isDrillActive || isChallengeActive;
      const controlsLocked = isStructuredModeActive || isSaCalibrating;

      micBtn.disabled = controlsLocked;
      findSaBtn.disabled = controlsLocked;
      setCurrentSaBtn.disabled = controlsLocked || !isListening || !lastStableFrequency;

      saSelect.disabled = controlsLocked;
      difficultySelect.disabled = controlsLocked;
      referenceDurationInput.disabled = controlsLocked;

      quickSaBtn.disabled = !quickSteps.mic;
      quickChallengeBtn.disabled = !quickSteps.sa;
    }

    function syncViewFlags() {
      pageBody.classList.toggle("is-challenge-active", isChallengeActive);
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function wrapCents(cents) {
      return ((cents + 600) % 1200 + 1200) % 1200 - 600;
    }

    function setDrillFill(percent) {
      drillFill.style.width = `${clamp(percent, 0, 100)}%`;
    }

    function setChallengeFill(percent) {
      challengeFill.style.width = `${clamp(percent, 0, 100)}%`;
    }

    function formatClock(ms) {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
      const sec = (totalSec % 60).toString().padStart(2, "0");
      return `${min}:${sec}`;
    }

    function emptyTrendStats() {
      return {
        high: {},
        low: {}
      };
    }

    function updateCoachTip(text) {
      coachTip.textContent = `Coach: ${text}`;
    }

    function defaultCoachTip() {
      return "Keep your breath steady and hold each note clearly.";
    }

    function bestIssueFromBucket(bucket) {
      let bestName = "";
      let bestCount = 0;
      for (const [name, count] of Object.entries(bucket)) {
        if (count > bestCount) {
          bestName = name;
          bestCount = count;
        }
      }
      return { name: bestName, count: bestCount };
    }

    function buildCoachTipFromStats() {
      const highIssue = bestIssueFromBucket(trendStats.high);
      const lowIssue = bestIssueFromBucket(trendStats.low);
      if (highIssue.count < 2 && lowIssue.count < 2) {
        return "Nice control. Try longer steady holds for stronger stability.";
      }
      if (highIssue.count >= lowIssue.count) {
        return `You are often high on ${highIssue.name || "this note"}. Relax slightly and come down.`;
      }
      return `You are often low on ${lowIssue.name || "this note"}. Lift the pitch a little.`;
    }

    function updateStatsStrip() {
      starsPill.textContent = `Stars: ${sessionStars}`;
      streakPill.textContent = `Streak: ${currentStreak} (Best ${bestStreak})`;
      const elapsed = isSessionActive ? performance.now() - sessionStartAt : sessionElapsedMs;
      timePill.textContent = `Time: ${formatClock(elapsed)}`;
    }

    function resetSessionMetrics(modeName) {
      sessionStars = 0;
      currentStreak = 0;
      bestStreak = 0;
      sessionStartAt = performance.now();
      sessionElapsedMs = 0;
      isSessionActive = true;
      sessionMode = modeName;
      trendStats = emptyTrendStats();
      lastTrendRecordAt = 0;
      hideSummary();
      updateCoachTip(defaultCoachTip());
      updateStatsStrip();
    }

    function registerSuccess() {
      sessionStars += 1;
      currentStreak += 1;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
      updateStatsStrip();
    }

    function registerPitchTrend(swaraName, centsRaw, now) {
      if (!isSessionActive) {
        return;
      }
      if (Math.abs(centsRaw) <= onPitchCents) {
        return;
      }
      if (now - lastTrendRecordAt < TREND_RECORD_INTERVAL_MS) {
        return;
      }
      lastTrendRecordAt = now;
      if (Math.abs(centsRaw) > onPitchCents * 1.5) {
        currentStreak = 0;
      }
      if (centsRaw > 0) {
        trendStats.high[swaraName] = (trendStats.high[swaraName] || 0) + 1;
      } else {
        trendStats.low[swaraName] = (trendStats.low[swaraName] || 0) + 1;
      }
      updateStatsStrip();
    }

    function showSummary(titleText) {
      if (isSessionActive) {
        sessionElapsedMs = performance.now() - sessionStartAt;
      }
      isSessionActive = false;
      const elapsed = sessionElapsedMs;
      const tip = buildCoachTipFromStats();
      summaryTitle.textContent = titleText;
      summaryBody.textContent = `${sessionMode} | Stars ${sessionStars} | Best streak ${bestStreak} | Time ${formatClock(elapsed)} | ${tip}`;
      summaryPanel.classList.remove("hidden");
      updateCoachTip(tip);
      updateStatsStrip();
      if (summaryHideTimer) {
        clearTimeout(summaryHideTimer);
      }
      summaryHideTimer = setTimeout(() => {
        summaryPanel.classList.add("hidden");
      }, 9000);
    }

    function hideSummary() {
      summaryPanel.classList.add("hidden");
      if (summaryHideTimer) {
        clearTimeout(summaryHideTimer);
        summaryHideTimer = null;
      }
    }

    function refreshQuickStartButtons() {
      quickMicBtn.classList.toggle("done", quickSteps.mic);
      quickSaBtn.classList.toggle("done", quickSteps.sa);
      quickChallengeBtn.classList.toggle("done", quickSteps.challenge);
      quickMicBtn.textContent = quickSteps.mic ? "1. Mic Ready" : "1. Mic Access";
      quickSaBtn.textContent = quickSteps.sa ? "2. Sa Ready" : "2. Find Sa";
      quickChallengeBtn.textContent = quickSteps.challenge ? "3. Challenge Done" : "3. Try 60s";

      if (!quickSteps.mic) {
        quickStartNote.textContent = "Step 1: allow microphone access.";
      } else if (!quickSteps.sa) {
        quickStartNote.textContent = "Step 2: sing one steady note to detect your Sa.";
      } else if (!quickSteps.challenge) {
        quickStartNote.textContent = "Step 3: play one quick challenge run.";
      } else {
        quickStartNote.textContent = "All set. Great start.";
      }

      syncControlState();
    }

    function updateQuickStartVisibility() {
      if (settings.onboarded) {
        quickStartPanel.classList.add("hidden");
        return;
      }
      quickStartPanel.classList.remove("hidden");
      refreshQuickStartButtons();
    }

    function markQuickStep(step, done = true) {
      quickSteps[step] = done;
      refreshQuickStartButtons();
      if (quickSteps.mic && quickSteps.sa && quickSteps.challenge) {
        settings.onboarded = true;
        persistSettings();
        quickStartPanel.classList.add("hidden");
      }
    }

    function applyDifficulty(value, persist = true) {
      const selected = DIFFICULTY_PRESETS[value] ? value : "normal";
      difficultySelect.value = selected;
      onPitchCents = DIFFICULTY_PRESETS[selected].onPitchCents;
      holdMs = DIFFICULTY_PRESETS[selected].holdMs;
      if (persist) {
        settings.difficulty = selected;
        persistSettings();
        setStatus(`Difficulty set to ${selected}.`);
      }
    }

    function applyReferenceDuration(value, persist = true) {
      referenceDurationSec = clamp(Number(value) || 4.5, 2, 8);
      referenceDurationInput.value = referenceDurationSec.toString();
      referenceDurationValue.textContent = `${referenceDurationSec.toFixed(1)}s`;
      if (persist) {
        settings.referenceDurationSec = referenceDurationSec;
        persistSettings();
      }
    }

    function setBaseSaFromOption(option, sourceLabel) {
      saSelect.value = option.value;
      baseSaFreq = option.frequency;
      settings.saValue = option.value;
      persistSettings();
      setStatus(`${sourceLabel}: ${option.noteName} (${option.frequency.toFixed(2)} Hz).`);
    }

    function applyModeTip(mode) {
      if (mode === "free") {
        setTipLine("Tip: Free Sing lets you explore your notes without targets.");
      } else if (mode === "drill") {
        setTipLine("Tip: Guided Drill moves to the next note after a clean hold.");
      } else {
        setTipLine("Tip: 60s Challenge is fast and fun. Collect as many stars as you can.");
      }
    }

    function setActiveMode(mode, persist = true) {
      const validMode = ["free", "drill", "challenge"].includes(mode) ? mode : "free";
      if (validMode !== "drill") {
        stopDrill();
      }
      if (validMode !== "challenge") {
        stopChallenge();
      }

      activeMode = validMode;
      modeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === validMode);
      });
      drillPanel.classList.toggle("hidden", validMode !== "drill");
      challengePanel.classList.toggle("hidden", validMode !== "challenge");
      applyModeTip(validMode);
      updateModePill();
      syncViewFlags();
      syncControlState();

      if (persist) {
        settings.activeMode = validMode;
        persistSettings();
      }
    }

    function resetDrillUi() {
      drillTarget.textContent = "-";
      drillProgress.textContent = `0/${DRILL_SEQUENCE.length}`;
      setDrillFill(0);
      drillBtn.textContent = "Start Drill";
      drillBtn.classList.remove("active");
    }

    function resetChallengeUi() {
      challengeTarget.textContent = "-";
      challengeTime.textContent = "01:00";
      setChallengeFill(0);
      challengeBtn.textContent = "Start Challenge";
      challengeBtn.classList.remove("active");
    }

    function setDrillStep(index) {
      const step = DRILL_SEQUENCE[index];
      if (!step) {
        return;
      }
      drillTarget.textContent = step.name;
      drillProgress.textContent = `Step ${index + 1}/${DRILL_SEQUENCE.length}`;
      setDrillFill(0);
      drillHoldStartAt = 0;
      setStatus(`Drill: sing ${step.name} and hold in tune.`);
      playReference(step.offset).catch((error) => console.error(error));
    }

    function setChallengeStep(index) {
      const step = DRILL_SEQUENCE[index % DRILL_SEQUENCE.length];
      challengeTarget.textContent = step.name;
      setChallengeFill(0);
      challengeHoldStartAt = 0;
      setStatus(`Challenge: hit ${step.name} and hold.`);
      playReference(step.offset).catch((error) => console.error(error));
    }

    function finishDrill() {
      isDrillActive = false;
      drillStepIndex = 0;
      drillHoldStartAt = 0;
      drillStepLockUntil = 0;
      resetDrillUi();
      setStatus("Drill complete. Great job.");
      feedbackLabel.textContent = "Drill complete";
      feedbackLabel.style.color = "var(--success)";
      syncControlState();
      syncViewFlags();
      showSummary("Guided Drill Complete");
    }

    function stopDrill(statusText = "") {
      if (!isDrillActive) {
        return;
      }
      isDrillActive = false;
      drillStepIndex = 0;
      drillHoldStartAt = 0;
      drillStepLockUntil = 0;
      resetDrillUi();
      if (statusText) {
        setStatus(statusText);
      }
      syncControlState();
      syncViewFlags();
      showSummary("Drill Stopped");
    }

    async function toggleDrill() {
      if (isDrillActive) {
        stopDrill("Drill stopped.");
        return;
      }

      if (isChallengeActive) {
        stopChallenge("Challenge stopped.");
      }
      if (isSaCalibrating) {
        setStatus("Finish Find My Sa first, then start drill.");
        return;
      }

      const started = await startListening();
      if (!started && !isListening) {
        return;
      }

      isDrillActive = true;
      drillStepIndex = 0;
      drillHoldStartAt = 0;
      drillStepLockUntil = 0;
      resetSessionMetrics("Guided Drill");
      drillBtn.textContent = "Stop Drill";
      drillBtn.classList.add("active");
      setDrillStep(drillStepIndex);
      syncControlState();
      syncViewFlags();
    }

    function finishChallenge() {
      if (!isChallengeActive) {
        return;
      }
      isChallengeActive = false;
      challengeStepIndex = 0;
      challengeHoldStartAt = 0;
      challengeStepLockUntil = 0;
      challengeEndsAt = 0;
      resetChallengeUi();
      setStatus("Challenge complete. Great work.");
      feedbackLabel.textContent = "Challenge complete";
      feedbackLabel.style.color = "var(--success)";
      markQuickStep("challenge", true);
      syncControlState();
      syncViewFlags();
      showSummary("60-Second Challenge Complete");
    }

    function stopChallenge(statusText = "") {
      if (!isChallengeActive) {
        return;
      }
      isChallengeActive = false;
      challengeStepIndex = 0;
      challengeHoldStartAt = 0;
      challengeStepLockUntil = 0;
      challengeEndsAt = 0;
      resetChallengeUi();
      if (statusText) {
        setStatus(statusText);
      }
      syncControlState();
      syncViewFlags();
      showSummary("Challenge Stopped");
    }

    async function toggleChallenge() {
      if (isChallengeActive) {
        stopChallenge("Challenge stopped.");
        return;
      }

      if (isDrillActive) {
        stopDrill("Drill stopped.");
      }
      if (isSaCalibrating) {
        setStatus("Finish Find My Sa first, then start challenge.");
        return;
      }

      const started = await startListening();
      if (!started && !isListening) {
        return;
      }

      isChallengeActive = true;
      challengeStepIndex = 0;
      challengeHoldStartAt = 0;
      challengeStepLockUntil = 0;
      challengeEndsAt = performance.now() + CHALLENGE_DURATION_MS;
      resetSessionMetrics("60s Challenge");
      challengeBtn.textContent = "Stop Challenge";
      challengeBtn.classList.add("active");
      setChallengeStep(challengeStepIndex);
      markQuickStep("challenge", true);
      syncControlState();
      syncViewFlags();
    }

    function updateDrillFromPitch(foldedSemitones, now) {
      if (!isDrillActive) {
        return;
      }

      if (now < drillStepLockUntil) {
        return;
      }

      const current = DRILL_SEQUENCE[drillStepIndex];
      if (!current) {
        return;
      }

      const centsToTarget = wrapCents((foldedSemitones - current.offset) * 100);
      if (Math.abs(centsToTarget) <= onPitchCents) {
        if (!drillHoldStartAt) {
          drillHoldStartAt = now;
        }
        const heldMs = now - drillHoldStartAt;
        setDrillFill((heldMs / holdMs) * 100);
        if (heldMs >= holdMs) {
          registerSuccess();
          drillStepIndex += 1;
          drillStepLockUntil = now + DRILL_STEP_GAP_MS;
          if (drillStepIndex >= DRILL_SEQUENCE.length) {
            finishDrill();
            return;
          }
          setDrillStep(drillStepIndex);
        }
      } else {
        drillHoldStartAt = 0;
        setDrillFill(0);
      }
    }

    function updateChallengeFromPitch(foldedSemitones, now) {
      if (!isChallengeActive) {
        return;
      }

      if (now >= challengeEndsAt) {
        finishChallenge();
        return;
      }
      if (now < challengeStepLockUntil) {
        return;
      }

      const current = DRILL_SEQUENCE[challengeStepIndex % DRILL_SEQUENCE.length];
      if (!current) {
        return;
      }

      const challengeHoldMs = Math.max(550, holdMs - 120);
      const centsToTarget = wrapCents((foldedSemitones - current.offset) * 100);
      if (Math.abs(centsToTarget) <= onPitchCents) {
        if (!challengeHoldStartAt) {
          challengeHoldStartAt = now;
        }
        const heldMs = now - challengeHoldStartAt;
        setChallengeFill((heldMs / challengeHoldMs) * 100);
        if (heldMs >= challengeHoldMs) {
          registerSuccess();
          challengeStepIndex += 1;
          challengeStepLockUntil = now + CHALLENGE_STEP_GAP_MS;
          setChallengeStep(challengeStepIndex);
        }
      } else {
        challengeHoldStartAt = 0;
        setChallengeFill(0);
      }
    }

    function updateChallengeTimer(now) {
      if (!isChallengeActive) {
        return;
      }
      const remaining = challengeEndsAt - now;
      challengeTime.textContent = formatClock(remaining);
      if (remaining <= 0) {
        finishChallenge();
      }
    }

    function resetCalibrationButton() {
      findSaBtn.disabled = false;
      findSaBtn.classList.remove("busy");
      findSaBtn.textContent = "Find My Sa";
      syncControlState();
    }

    function applySaFromFrequency(targetFrequency, sourceLabel) {
      const suggested = nearestSaOption(targetFrequency);
      setBaseSaFromOption(suggested, sourceLabel);
      resetLiveFeedback(`Base Sa set to ${suggested.noteName}.`);
    }

    async function beginSaCalibration() {
      if (isSaCalibrating) {
        return;
      }
      if (isDrillActive) {
        stopDrill("Drill paused for Sa calibration.");
      }

      const started = await startListening();
      if (!started && !isListening) {
        return;
      }

      isSaCalibrating = true;
      calibrationStartTime = performance.now();
      calibrationSamples = [];
      findSaBtn.disabled = true;
      findSaBtn.classList.add("busy");
      findSaBtn.textContent = "Listening...";
      setStatus("Finding Sa. Sing one comfortable steady note.");
      feedbackLabel.textContent = "Calibrating...";
      feedbackLabel.style.color = "var(--muted)";
      meterTarget.classList.remove("glow");
      onPitchStartTime = null;
      syncControlState();
      syncViewFlags();
    }

    function finishSaCalibration() {
      isSaCalibrating = false;
      resetCalibrationButton();

      if (calibrationSamples.length < CALIBRATION_MIN_SAMPLES) {
        setStatus("Could not detect clearly. Try Find My Sa again in a quieter room.");
        feedbackLabel.textContent = "Not enough stable pitch data";
        feedbackLabel.style.color = "var(--off)";
        return;
      }

      const stableFrequency = trimmedMedian(calibrationSamples);
      if (!stableFrequency) {
        setStatus("Calibration failed. Please try again.");
        feedbackLabel.textContent = "No valid pitch detected";
        feedbackLabel.style.color = "var(--off)";
        return;
      }

      const suggested = nearestSaOption(stableFrequency);
      setBaseSaFromOption(suggested, "Suggested Sa");
      markQuickStep("sa", true);

      const difference = centsBetween(stableFrequency, suggested.frequency);
      const direction =
        difference > 15 ? "a little high" :
        difference < -15 ? "a little low" :
        "very close";

      feedbackLabel.textContent = `Set to ${suggested.noteName}. Your note was ${direction}.`;
      feedbackLabel.style.color = "var(--success)";
      setSwaraLabel("-", false);
      meterIndicator.style.bottom = "50%";
      meterIndicator.style.backgroundColor = "#1b2b3b";
      meterTarget.classList.remove("glow");
      onPitchStartTime = null;
      syncControlState();
      syncViewFlags();
    }

    function useCurrentNoteAsSa() {
      if (!isListening) {
        setStatus("Start listening first, then sing and tap Use Current as Sa.");
        return;
      }
      if (!lastStableFrequency) {
        setStatus("No stable note detected yet. Sing a steady note and try again.");
        return;
      }
      if (isDrillActive) {
        stopDrill("Drill stopped after Sa update.");
      }
      if (isChallengeActive) {
        stopChallenge("Challenge stopped after Sa update.");
      }
      markQuickStep("sa", true);
      applySaFromFrequency(lastStableFrequency, "Sa set from current note");
    }

    function getAudioContext() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioContext;
    }

    async function startListening() {
      if (isListening) {
        return true;
      }

      try {
        await pitchfinderReadyPromise;
        if (!pitchfinderReady || !YIN) {
          setStatus("Pitch engine could not load. Check internet and reload.");
          return false;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        const ctx = getAudioContext();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        analyser = ctx.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0.2;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        detectPitch = YIN({ sampleRate: ctx.sampleRate });
        isListening = true;
        micBtn.classList.remove("denied");
        micBtn.classList.add("listening");
        micBtn.textContent = "Listening";
        setStatus("Mic active. Start singing.");
        markQuickStep("mic", true);
        lastPitchAt = performance.now();
        lastVoiceAt = lastPitchAt;
        isVoiceActive = false;
        syncControlState();
        syncViewFlags();

        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        tick();
        return true;
      } catch (error) {
        isListening = false;
        micBtn.classList.remove("listening");
        micBtn.classList.add("denied");
        micBtn.textContent = "Mic Blocked";
        setStatus("Microphone access denied or unavailable.");
        resetCalibrationButton();
        syncControlState();
        syncViewFlags();
        console.error(error);
        return false;
      }
    }

    function tick() {
      if (!isListening || !analyser || !detectPitch) {
        return;
      }

      const now = performance.now();
      const samples = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(samples);
      const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);

      if (!isVoiceActive && rms >= VOICE_ON_GATE) {
        isVoiceActive = true;
        lastVoiceAt = now;
      } else if (isVoiceActive && rms >= VOICE_OFF_GATE) {
        lastVoiceAt = now;
      } else if (isVoiceActive && now - lastVoiceAt > VOICE_HANGOVER_MS) {
        isVoiceActive = false;
      }

      if (isVoiceActive) {
        const rawFrequency = detectPitch(samples);
        if (rawFrequency && rawFrequency >= CALIBRATION_MIN_HZ && rawFrequency <= CALIBRATION_MAX_HZ) {
          recentFrequencies.push(rawFrequency);
          if (recentFrequencies.length > SMOOTHING_WINDOW) {
            recentFrequencies.shift();
          }

          const smoothedFrequency = median(recentFrequencies) || rawFrequency;
          lastStableFrequency = smoothedFrequency;
          lastPitchAt = now;
          syncControlState();

          if (isSaCalibrating) {
            calibrationSamples.push(smoothedFrequency);
          }
          processPitch(smoothedFrequency);
        } else {
          if (now - lastPitchAt > NO_PITCH_GRACE_MS) {
            showNoPitchHint();
          }
        }
      } else {
        if (now - lastVoiceAt > SILENCE_RESET_MS) {
          resetLiveFeedback(isSaCalibrating ? "Calibrating..." : "Listening...");
        }
      }

      if (isSaCalibrating && now - calibrationStartTime >= CALIBRATION_MS) {
        finishSaCalibration();
      }

      updateChallengeTimer(now);
      if (isSessionActive) {
        updateStatsStrip();
      }

      rafId = requestAnimationFrame(tick);
    }

    function processPitch(frequency) {
      const exactSemitones = 12 * Math.log2(frequency / baseSaFreq);
      const foldedSemitones = ((exactSemitones % 12) + 12) % 12;

      let nearest = SHUDDH_SWARAS[0];
      let centsDifference = Number.POSITIVE_INFINITY;

      for (const swara of SHUDDH_SWARAS) {
        const diff = wrapCents((foldedSemitones - swara.offset) * 100);
        if (Math.abs(diff) < Math.abs(centsDifference)) {
          centsDifference = diff;
          nearest = swara;
        }
      }

      const displayCents = clamp(centsDifference, -WARN_CENTS, WARN_CENTS);
      renderPitch(nearest.name, centsDifference, displayCents);
      const now = performance.now();
      registerPitchTrend(nearest.name, centsDifference, now);
      updateDrillFromPitch(foldedSemitones, now);
      updateChallengeFromPitch(foldedSemitones, now);
    }

    function renderPitch(swaraName, centsRaw, centsDisplay) {
      setSwaraLabel(swaraName, true);
      if (!isSaCalibrating && !isDrillActive && !isChallengeActive) {
        setStatus("Mic active. Start singing.");
      }

      const bottomPercent = 50 + centsDisplay;
      meterIndicator.style.bottom = `${bottomPercent}%`;

      if (Math.abs(centsRaw) <= onPitchCents) {
        feedbackLabel.textContent = "On Pitch";
        feedbackLabel.style.color = "var(--success)";
        meterIndicator.style.backgroundColor = "var(--success)";

        if (!onPitchStartTime) {
          onPitchStartTime = performance.now();
        }
        if (performance.now() - onPitchStartTime >= STABILITY_THRESHOLD_MS) {
          meterTarget.classList.add("glow");
        }
        return;
      }

      onPitchStartTime = null;
      meterTarget.classList.remove("glow");

      if (Math.abs(centsRaw) > WARN_CENTS) {
        feedbackLabel.textContent = centsRaw > 0 ? "High (Off Target)" : "Low (Off Target)";
        feedbackLabel.style.color = "var(--off)";
        meterIndicator.style.backgroundColor = "var(--off)";
      } else {
        feedbackLabel.textContent = centsRaw > 0 ? "High" : "Low";
        feedbackLabel.style.color = "var(--warning)";
        meterIndicator.style.backgroundColor = "var(--warning)";
      }
    }

    function showNoPitchHint() {
      onPitchStartTime = null;
      meterTarget.classList.remove("glow");
      if (isDrillActive) {
        drillHoldStartAt = 0;
        setDrillFill(0);
      }
      if (isChallengeActive) {
        challengeHoldStartAt = 0;
        setChallengeFill(0);
      }
      if (isSaCalibrating) {
        feedbackLabel.textContent = "Calibrating...";
      } else {
        feedbackLabel.textContent = "Hold a steady note...";
      }
      feedbackLabel.style.color = "var(--muted)";
    }

    function resetLiveFeedback(labelText) {
      setSwaraLabel("-", false);
      feedbackLabel.textContent = labelText;
      feedbackLabel.style.color = "var(--muted)";
      meterIndicator.style.bottom = "50%";
      meterIndicator.style.backgroundColor = "#1b2b3b";
      meterTarget.classList.remove("glow");
      onPitchStartTime = null;
      recentFrequencies = [];
    }

    function getReferenceFrequency(offset) {
      return baseSaFreq * Math.pow(2, offset / 12);
    }

    function stopActiveReference(ctx) {
      if (!activeReference) {
        return;
      }

      const { osc, gain } = activeReference;
      const now = ctx.currentTime;

      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + REFERENCE_RELEASE_SEC);
        osc.stop(now + REFERENCE_RELEASE_SEC + 0.01);
      } catch (error) {
        console.error(error);
      }

      activeReference = null;
    }

    async function playReference(offset) {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      stopActiveReference(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = getReferenceFrequency(offset);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(REFERENCE_LEVEL, now + REFERENCE_ATTACK_SEC);
      gain.gain.setValueAtTime(
        REFERENCE_LEVEL,
        now + Math.max(REFERENCE_ATTACK_SEC, referenceDurationSec - REFERENCE_RELEASE_SEC)
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + referenceDurationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + referenceDurationSec + 0.01);

      activeReference = { osc, gain };
      osc.onended = () => {
        if (activeReference && activeReference.osc === osc) {
          activeReference = null;
        }
      };
    }

    function runQuickChallengeStart() {
      setActiveMode("challenge");
      toggleChallenge().catch((error) => console.error(error));
      quickStartNote.textContent = "Challenge started. Collect as many stars as you can.";
    }

    function initializeUiFromSettings() {
      applyDifficulty(settings.difficulty, false);
      applyReferenceDuration(settings.referenceDurationSec, false);
      setActiveMode(settings.activeMode, false);
      updateQuickStartVisibility();
      refreshQuickStartButtons();
      setSwaraLabel("-", false);
      updateStatsStrip();
      updateCoachTip(defaultCoachTip());
      resetDrillUi();
      resetChallengeUi();
      updateModePill();
      syncControlState();
      syncViewFlags();
    }

    populateSaOptions();
    initializeUiFromSettings();

    micBtn.addEventListener("click", startListening);
    findSaBtn.addEventListener("click", beginSaCalibration);
    setCurrentSaBtn.addEventListener("click", useCurrentNoteAsSa);
    drillBtn.addEventListener("click", () => {
      toggleDrill().catch((error) => console.error(error));
    });
    challengeBtn.addEventListener("click", () => {
      toggleChallenge().catch((error) => console.error(error));
    });
    difficultySelect.addEventListener("change", (event) => {
      applyDifficulty(event.target.value);
    });
    referenceDurationInput.addEventListener("input", (event) => {
      applyReferenceDuration(event.target.value);
    });
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveMode(button.dataset.mode);
      });
    });
    quickMicBtn.addEventListener("click", () => {
      startListening().catch((error) => console.error(error));
    });
    quickSaBtn.addEventListener("click", () => {
      beginSaCalibration().catch((error) => console.error(error));
    });
    quickChallengeBtn.addEventListener("click", runQuickChallengeStart);

    saSelect.addEventListener("change", () => {
      if (isDrillActive) {
        stopDrill("Drill stopped after Sa change.");
      }
      if (isChallengeActive) {
        stopChallenge("Challenge stopped after Sa change.");
      }
      const selected = getSelectedSaOption();
      setBaseSaFromOption(selected, "Base Sa changed");
      resetLiveFeedback("Sa changed. Sing to tune.");
    });

    referenceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const offset = Number.parseInt(button.dataset.offset, 10);
        playReference(offset).catch((error) => console.error(error));
      });
    });
