import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamInterface from '../components/ExamInterface';
import { completeSession, startSession } from '../services/examService';
import { useAuth } from '../context/AuthContext';

const questionIds = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function ExamPage() {
  const { token, user, logout } = useAuth();
  const [session, setSession] = useState(null);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data } = await startSession(token, {
        examId: 'CYBER-101',
        studentID: user.studentID,
        questions: questionIds,
        fingerprintHash: btoa(navigator.userAgent)
      });
      setSession(data);
    };
    init();
  }, [token, user]);

  const finishExam = async () => {
    const { data } = await completeSession(token, session._id);
    setReport(data);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-5 text-white">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Integrity First Exam</h1>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded bg-slate-700 px-3 py-2"
        >
          Logout
        </button>
      </header>
      {report ? (
        <section className="rounded-xl bg-slateGlass p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold">Final Credibility Report</h2>
          <p>Student ID: {report.studentID}</p>
          <p>Trust Score: {report.trustScore} / 100</p>
          <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-sm">{JSON.stringify(report.violationCounts, null, 2)}</pre>
        </section>
      ) : (
        session && <ExamInterface token={token} session={session} onComplete={finishExam} />
      )}
    </main>
  );
}
