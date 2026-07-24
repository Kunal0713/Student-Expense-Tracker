import { useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';

// Layout & Context
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy Loaded Pages for Performance Optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Page Fallback Spinner for Suspense
const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-9 h-9 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Loading Page...</p>
    </div>
  </div>
);

// Scroll to Top & Title Handler
const PageWrapper = ({ children, title }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = title ? `${title} · ExpenseTrack` : 'ExpenseTrack · Student Expense Engine';
  }, [location.pathname, title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route 
                path="/" 
                element={
                  <PageWrapper title="Home">
                    <Home />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PageWrapper title="About Architecture">
                    <About />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PageWrapper title="Contact & Support">
                    <Contact />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PageWrapper title="Sign In">
                    <Login />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PageWrapper title="Create Account">
                    <Register />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <PageWrapper title="Expense Dashboard">
                      <Dashboard />
                    </PageWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <PageWrapper title="User Profile">
                      <Profile />
                    </PageWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <PageWrapper title="Preferences & Settings">
                      <Settings />
                    </PageWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="*" 
                element={
                  <PageWrapper title="404 Page Not Found">
                    <NotFound />
                  </PageWrapper>
                } 
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />

      <ToastContainer 
        position="top-right" 
        autoClose={2500} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;