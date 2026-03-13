export const estimateHeadDirection = (landmarks = []) => {
  if (!landmarks.length) return 'CENTER';
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  if (!leftEye || !rightEye) return 'CENTER';
  const delta = rightEye.x - leftEye.x;
  if (delta < 0.03) return 'LEFT';
  if (delta > 0.08) return 'RIGHT';
  return 'CENTER';
};
