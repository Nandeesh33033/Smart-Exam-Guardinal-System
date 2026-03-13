import { motion } from 'framer-motion';

export default function QuestionRenderer({ questions, currentIndex, onNext }) {
  const current = questions[currentIndex];
  if (!current) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slateGlass p-6 shadow-glass backdrop-blur-md"
    >
      <p className="mb-3 text-xs uppercase tracking-wider text-cyan-300">Question {currentIndex + 1}</p>
      <div className="question rounded-xl bg-slate-900/60 p-4 text-slate-100 transition hover:filter-none">
        {current.prompt}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
      >
        Next Question
      </button>
    </motion.section>
  );
}
