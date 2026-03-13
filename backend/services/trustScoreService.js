const PENALTY_TABLE = {
  TAB_SWITCH: 15,
  WINDOW_RESIZE: 10,
  COPY_ATTEMPT: 20,
  IDLE_DETECTED: 5,
  MULTIPLE_FACES: 30,
  VOICE_DETECTED: 20,
  LOOKING_AWAY: 10,
  FULLSCREEN_EXIT: 15,
  FACE_MISSING: 15,
  TALKING: 20,
  PROHIBITED_OBJECT: 30
};

export const calculateTrustScore = (violations = []) => {
  const totalPenalty = violations.reduce((sum, violation) => sum + (PENALTY_TABLE[violation.type] || 5), 0);
  return Math.max(0, 100 - totalPenalty);
};

export const summarizeViolations = (violations = []) =>
  violations.reduce((acc, violation) => {
    acc[violation.type] = (acc[violation.type] || 0) + 1;
    return acc;
  }, {});

export { PENALTY_TABLE };
