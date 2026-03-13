import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExamPage from './pages/ExamPage';
import AuditorPage from './pages/AuditorPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/exam"
      element={
        <ProtectedRoute roles={['student', 'admin']}>
          <ExamPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/auditor"
      element={
        <ProtectedRoute roles={['auditor', 'admin']}>
          <AuditorPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
