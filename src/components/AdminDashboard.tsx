import React, { useState, useRef, useEffect } from 'react';
import { db } from '../lib/db';
import type { StudentRecord } from '../lib/db';
import { Search, Users, LogOut, ShieldCheck, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Single brand accent color — used for all primary actions
const ACCENT = '#C8102E';
const ACCENT_HOVER = '#A50D26';

interface Props { onLogout: () => void; }

export const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    db.getRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  const filtered = records.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.passportNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.school.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = (type: 'excel' | 'pdf') => {
    setExportOpen(false);
    if (type === 'excel') db.exportToExcel(records);
    else db.exportToPDF(records);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: ACCENT }}>
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111] leading-tight">Consular Dashboard</h2>
            <p className="text-[#8A8A8A] text-sm font-medium">
              {loading ? 'Loading records...' : `${records.length} student${records.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(v => !v)}
              onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-bold text-white transition-colors"
              style={{ background: ACCENT }}>
              Export <ChevronDown size={14} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {exportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-12 z-30 bg-white border border-[#E8E8E4] rounded-xl shadow-lg overflow-hidden w-44">
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] font-semibold text-[#111] hover:bg-[#F7F7F5] transition-colors">
                    <FileSpreadsheet size={15} style={{ color: '#006600' }} /> Export Excel
                  </button>
                  <div className="border-t border-[#F0F0EE]" />
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] font-semibold text-[#111] hover:bg-[#F7F7F5] transition-colors">
                    <FileText size={15} style={{ color: ACCENT }} /> Export PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign out */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold text-[#8A8A8A] bg-white border border-[#E8E8E4] hover:border-[#BBB] hover:text-[#333] transition-all">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD]" />
        <input
          className="w-full h-12 border border-[#E8E8E4] rounded-xl pl-11 pr-4 text-[14px] font-medium text-[#111] bg-white outline-none transition-all placeholder:text-[#BDBDBD] focus:border-[#111]"
          placeholder="Search by name, passport, or university…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#E8E8E4] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#F0F0EE] bg-[#FAFAF8]">
                {[
                  'Full Name', 'Phone', 'Passport', 'University',
                  'Next of Kin', 'NK Phone', 'Date'
                ].map((h, i) => (
                  <th key={h}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A] whitespace-nowrap ${i === 6 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F3]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#111] whitespace-nowrap">{r.fullName}</td>
                  <td className="px-5 py-3.5 text-[#555] whitespace-nowrap">{r.phoneNumber}</td>
                  <td className="px-5 py-3.5 font-mono font-bold whitespace-nowrap" style={{ color: ACCENT }}>{r.passportNumber}</td>
                  <td className="px-5 py-3.5 text-[#444] max-w-[160px] truncate">{r.school}</td>
                  <td className="px-5 py-3.5 text-[#444] whitespace-nowrap">{r.nextOfKinName}</td>
                  <td className="px-5 py-3.5 text-[#8A8A8A] whitespace-nowrap">{r.nextOfKinPhone}</td>
                  <td className="px-5 py-3.5 text-[#ABABAB] text-right font-mono text-xs whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <p className="text-[#8A8A8A] font-medium text-sm">Loading records securely from database...</p>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#F5F5F3' }}>
                        <Users size={22} style={{ color: '#BDBDBD' }} />
                      </div>
                      <p className="text-[#8A8A8A] font-medium text-sm">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};
