import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { fetchAuditorOverview } from '../services/violationService';
import { createSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AuditorPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchAuditorOverview(token).then(({ data }) => setRows(data));
    const socket = createSocket();
    socket.on('violation:new', () => {
      fetchAuditorOverview(token).then(({ data }) => setRows(data));
    });
    return () => socket.disconnect();
  }, [token]);

  const chartData = useMemo(() => ({
    labels: rows.map((r) => r.studentID),
    datasets: [
      {
        label: 'Trust Score',
        data: rows.map((r) => r.trustScore),
        backgroundColor: 'rgba(34, 211, 238, 0.5)'
      }
    ]
  }), [rows]);

  return (
    <main className="min-h-screen bg-slate-950 p-5 text-white">
      <h1 className="mb-4 text-2xl font-bold">Auditor Dashboard</h1>
      <div className="mb-4 rounded-xl bg-slateGlass p-4 backdrop-blur-md">
        <Bar data={chartData} />
      </div>
      <div className="overflow-x-auto rounded-xl bg-slateGlass p-4 backdrop-blur-md">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Student</th>
              <th>Tab Switch</th>
              <th>Resize</th>
              <th>Idle</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.sessionId}>
                <td>{row.studentID}</td>
                <td>{row.violationCounts.TAB_SWITCH || 0}</td>
                <td>{row.violationCounts.WINDOW_RESIZE || 0}</td>
                <td>{row.violationCounts.IDLE_DETECTED || 0}</td>
                <td>{row.trustScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
