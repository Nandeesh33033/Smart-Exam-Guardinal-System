import { useCallback, useEffect, useMemo, useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import ViolationTracker from './ViolationTracker';
import CopyProtection from './CopyProtection';
import IdleDetector from './IdleDetector';
import FullscreenManager from './FullscreenManager';
import CameraMonitor from './CameraMonitor';
import { logViolation } from '../services/violationService';

const sampleQuestions = [
  { id: 'Q1', prompt: 'Explain the concept of zero trust security.' },
  { id: 'Q2', prompt: 'What is the role of CSP in browser hardening?' },
  { id: 'Q3', prompt: 'How does WebRTC negotiate peer connections?' },
  { id: 'Q4', prompt: 'Describe JWT best practices.' }
];

const fingerprint = () => `${navigator.userAgent}-${screen.width}-${screen.height}`;

export default function ExamInterface({ token, session, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [violations, setViolations] = useState([]);
  const [trustScore, setTrustScore] = useState(100);
  const [awayAt, setAwayAt] = useState(null);

  const questions = useMemo(() => {
    if (session?.questionOrder?.length) {
      return session.questionOrder.map((id) => sampleQuestions.find((q) => q.id === id)).filter(Boolean);
    }
    return sampleQuestions;
  }, [session]);

  const sendViolation = useCallback(
    async (type, metadata = {}) => {
      if (!session?._id) return;
      const payload = {
        sessionId: session._id,
        studentID: session.studentID,
        type,
        metadata: {
          ...metadata,
          fingerprintHash: btoa(fingerprint())
        },
        timestamp: new Date().toISOString()
      };

      setViolations((prev) => [payload, ...prev].slice(0, 100));
      const response = await logViolation(token, payload).catch(() => null);
      if (response?.data?.trustScore !== undefined) {
        setTrustScore(response.data.trustScore);
      }
    },
    [session, token]
  );

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) setAwayAt(Date.now());
      if (!document.hidden && awayAt) {
        const duration = Math.round((Date.now() - awayAt) / 1000);
        sendViolation('TAB_SWITCH', { duration });
        setAwayAt(null);
      }
    };

    const onResize = () => {
      if (window.innerWidth < window.screen.width * 0.8) sendViolation('WINDOW_RESIZE');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
    };
  }, [awayAt, sendViolation]);

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <QuestionRenderer
          questions={questions}
          currentIndex={currentIndex}
          onNext={() => {
            if (currentIndex + 1 >= questions.length) onComplete();
            else setCurrentIndex((idx) => idx + 1);
          }}
        />
        <CameraMonitor onViolation={sendViolation} />
      </div>
      <ViolationTracker violations={violations} trustScore={trustScore} />
      <CopyProtection onViolation={sendViolation} />
      <IdleDetector onViolation={sendViolation} />
      <FullscreenManager onViolation={sendViolation} />
    </div>
  );
}
