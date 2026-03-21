import React, { useState } from 'react';
import { RegistryForm } from './components/RegistryForm';
import { AdminDashboard } from './components/AdminDashboard';
import { db } from './lib/db';
import { ShieldCheck, Lock, MapPin } from 'lucide-react';

const ACCENT = '#C8102E';
import './index.css';

function App() {
  const [view, setView] = useState<'register' | 'admin_auth' | 'admin'>('register');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    const isValid = await db.verifyAdminCode(password);
    setIsVerifying(false);

    if (isValid) {
      setAdminCode(password);
      setView('admin');
      setError('');
      setPassword('');
    } else {
      setError('Incorrect access code. Unrecognized credentials.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-red-100">

      {/* ── Top Nav ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#D2D2D7]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-[52px] flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg shadow-sm"
                 style={{ background: ACCENT }}>
              <MapPin size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-[14px] tracking-tight text-[#1D1D1F]">Kenyan Consular</span>
              <span className="hidden sm:inline text-[#86868B] text-[12px] ml-1.5 font-medium">Registry Office</span>
            </div>
          </div>

          {/* Navigation pills */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('register')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors duration-100 ${
                view === 'register'
                  ? 'bg-[#1D1D1F] text-white shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero Banner (register view only) ── */}
      {view === 'register' && (
        <div className="bg-white border-b border-[#D2D2D7]/30">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
                Official Student Registration.
              </h1>
              <p className="mt-4 text-[#86868B] text-[16px] md:text-[18px] font-medium leading-relaxed">
                Operated by the Kenyan Consular Office in Türkiye for students in Northern Cyprus (TRNC).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="w-full">

          {view === 'register' && (
            <div key="register">
              <RegistryForm />
            </div>
          )}

          {view === 'admin_auth' && (
            <div key="auth" className="max-w-sm mx-auto pt-6">
              <div className="bg-white rounded-[24px] border border-[#D2D2D7]/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                       style={{ background: ACCENT }}>
                    <Lock size={22} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1D1D1F]">Consular Access</h2>
                  <p className="text-[#86868B] text-sm mt-1.5 font-medium">Verify your access credentials.</p>
                </div>

                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-14 border border-[#D2D2D7] rounded-2xl px-4 text-center text-2xl font-bold tracking-[0.4em] outline-none transition-all bg-[#F5F5F7] focus:bg-white focus:border-[#1D1D1F]"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {error && (
                    <p className="text-center text-[13px] font-bold" style={{ color: ACCENT }}>{error}</p>
                  )}
                  <button type="submit"
                    disabled={isVerifying || password.length !== 6}
                    className="w-full h-12 rounded-2xl font-bold text-[15px] text-white transition-opacity disabled:opacity-30 active:scale-[0.98]"
                    style={{ background: '#1D1D1F' }}>
                    {isVerifying ? 'Verifying...' : 'Authorize'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {view === 'admin' && (
            <div key="admin">
              <AdminDashboard onLogout={() => { setView('register'); setAdminCode(''); }} adminCode={adminCode} />
            </div>
          )}

        </div>
      </main>

      <footer className="py-12 bg-white border-t border-[#D2D2D7]/30 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-[#86868B] font-medium tracking-tight">
            © 2026 Kenyan Consular Office in Türkiye · Secure Data Portal
          </p>
          <button
            onClick={() => view !== 'admin' && setView('admin_auth')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#86868B] hover:text-[#1D1D1F] transition-colors uppercase tracking-[0.1em]"
          >
            <ShieldCheck size={13} strokeWidth={2.5} />
            Admin Login
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
