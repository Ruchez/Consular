import React, { useState } from 'react';
import { RegistryForm } from './components/RegistryForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ShieldCheck, UserPlus, LogIn, Lock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#C8102E';
const ACCENT_HOVER = '#A50D26';
import './index.css';

function App() {
  const [view, setView] = useState<'register' | 'admin_auth' | 'admin'>('register');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '270603') {
      setView('admin');
      setError('');
      setPassword('');
    } else {
      setError('Incorrect access code.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111] font-sans">

      {/* ── Top Nav ── */}
      <header className="bg-white border-b border-[#E8E8E4] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg"
                 style={{ background: ACCENT }}>
              <MapPin size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="font-bold text-[15px] tracking-tight text-[#111]">Kenyan Consular</span>
              <span className="hidden sm:inline text-[#8A8A8A] text-[13px] ml-2">· TRNC Registry</span>
            </div>
          </div>

          {/* Navigation pills */}
          <nav className="flex items-center gap-1 bg-[#F2F2F0] rounded-xl p-1">
            <button
              onClick={() => setView('register')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                view === 'register'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#333]'
              }`}
            >
              <UserPlus size={13} strokeWidth={2.5} />
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero Banner (register view only) ── */}
      {view === 'register' && (
        <div className="border-b border-[#E8E8E4] bg-white">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-start gap-4">
              <div className="w-1 h-14 rounded-full flex-shrink-0 mt-1"
                   style={{ background: ACCENT }} />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#111] leading-tight">
                  Student Registration Portal
                </h1>
                <p className="mt-2 text-[#8A8A8A] text-[15px] font-medium max-w-xl">
                  Official data collection portal for Kenyan nationals studying in Northern Cyprus (TRNC). Operated by the Kenyan Consular Office in Türkiye.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {view === 'register' && (
            <motion.div key="register"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <RegistryForm />
            </motion.div>
          )}

          {view === 'admin_auth' && (
            <motion.div key="auth"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-sm mx-auto pt-6">
              <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                       style={{ background: ACCENT }}>
                    <Lock size={22} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#111]">Consular Access</h2>
                  <p className="text-[#8A8A8A] text-sm mt-1">Enter your 6-digit code.</p>
                </div>

                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={password}
                    onChange={e => setPassword(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-14 border border-[#E8E8E4] rounded-xl px-4 text-center text-2xl font-bold tracking-[0.4em] outline-none transition-all bg-[#F7F7F5] focus:bg-white focus:border-[#111]"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {error && (
                    <p className="text-center text-sm font-semibold" style={{ color: '#C8102E' }}>{error}</p>
                  )}
                  <button type="submit"
                    onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
                    onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                    className="w-full h-12 rounded-xl font-bold text-[15px] text-white active:scale-[0.98] transition-colors"
                    style={{ background: ACCENT }}>
                    <LogIn size={16} className="inline mr-2" />
                    Authorize
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div key="admin"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}>
              <AdminDashboard onLogout={() => setView('register')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="border-t border-[#E8E8E4] py-8 mt-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#ABABAB] font-medium tracking-wide">
            © 2026 Kenyan Consular Office in Türkiye &nbsp;·&nbsp; Secure Government Data Portal
          </p>
          <button
            onClick={() => view !== 'admin' && setView('admin_auth')}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#8A8A8A] hover:text-[#C8102E] transition-colors uppercase tracking-widest"
          >
            <ShieldCheck size={13} strokeWidth={2.5} />
            Consular Login
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
