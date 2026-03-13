import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../services/examService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      login(data);
      navigate(data.user.role === 'auditor' ? '/auditor' : '/exam');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md rounded-2xl bg-slateGlass p-6 shadow-glass backdrop-blur-md">
        <h1 className="mb-5 text-2xl font-bold text-white">Exam Guardrail Login</h1>
        <input className="mb-3 w-full rounded-lg bg-slate-800 p-3 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="mb-3 w-full rounded-lg bg-slate-800 p-3 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mb-2 text-sm text-red-300">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-slate-900">Sign In</button>
      </motion.form>
    </main>
  );
}
