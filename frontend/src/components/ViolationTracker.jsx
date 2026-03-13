export default function ViolationTracker({ violations, trustScore }) {
  return (
    <aside className="rounded-2xl bg-slateGlass p-4 shadow-glass backdrop-blur-md">
      <h3 className="text-lg font-semibold text-white">Live Violations</h3>
      <p className="mb-3 text-sm text-cyan-200">Trust Score: {trustScore}</p>
      <ul className="max-h-64 space-y-2 overflow-y-auto text-sm text-slate-200">
        {violations.map((v, idx) => (
          <li key={`${v.type}-${idx}`} className="rounded bg-slate-900/60 p-2">
            <p className="font-medium">{v.type}</p>
            <p className="text-xs text-slate-400">{new Date(v.timestamp).toLocaleTimeString()}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
