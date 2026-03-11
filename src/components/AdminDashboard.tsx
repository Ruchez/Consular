import React, { useState, useRef, useEffect } from 'react';
import { db } from '../lib/db';
import type { StudentRecord } from '../lib/db';
import { Search, Users, LogOut, ShieldCheck, ChevronDown, FileSpreadsheet, FileText, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Single brand accent color — used for all primary actions
const ACCENT = '#C8102E';
const ACCENT_HOVER = '#A50D26';

interface Props { onLogout: () => void; adminCode: string; }

export const AdminDashboard: React.FC<Props> = ({ onLogout, adminCode }) => {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const fetchRecords = () => {
    setLoading(true);
    db.getRecords(adminCode).then(data => {
      setRecords(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRecords();
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

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(r => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteCode !== adminCode) {
      setDeleteError('Incorrect access code.');
      setDeleteCode('');
      return;
    }
    
    setIsDeleting(true);
    try {
      await db.deleteRecords(Array.from(selectedIds), adminCode);
      setDeleteModalOpen(false);
      setDeleteCode('');
      setDeleteError('');
      setSelectedIds(new Set());
      fetchRecords();
    } catch (err) {
      setDeleteError('Failed to delete records.');
    } finally {
      setIsDeleting(false);
    }
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
          {/* Delete Button (Conditional) */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ACCENT }}>
                <Trash2 size={14} /> Delete ({selectedIds.size})
              </motion.button>
            )}
          </AnimatePresence>

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
                <th className="px-5 py-3.5 w-10">
                  <input 
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    disabled={filtered.length === 0}
                    className="w-4 h-4 rounded border-[#E8E8E4] text-[#C8102E] focus:ring-[#C8102E]"
                  />
                </th>
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
                <tr key={r.id} className={`hover:bg-[#FAFAF8] transition-colors ${selectedIds.has(r.id) ? 'bg-red-50/50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="w-4 h-4 rounded border-[#E8E8E4] text-[#C8102E] focus:ring-[#C8102E]"
                    />
                  </td>
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
                  <td colSpan={8} className="py-20 text-center">
                    <p className="text-[#8A8A8A] font-medium text-sm">Loading records securely from database...</p>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
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

      {/* ── Deletion Modal ── */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#E8E8E4] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
                    <Trash2 size={20} style={{ color: ACCENT }} />
                  </div>
                  <button onClick={() => !isDeleting && setDeleteModalOpen(false)} className="text-[#BDBDBD] hover:text-[#111]">
                    <X size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-[#111] mb-2">Delete {selectedIds.size} Record{selectedIds.size !== 1 ? 's' : ''}?</h3>
                <p className="text-sm text-[#8A8A8A] mb-6">
                  This action is permanent and cannot be undone. Enter the Consular access code to confirm.
                </p>

                <form onSubmit={handleDelete} className="space-y-4">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={deleteCode}
                    onChange={e => setDeleteCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 border border-[#E8E8E4] rounded-xl px-4 text-center text-xl font-bold tracking-[0.4em] outline-none transition-all bg-[#F7F7F5] focus:bg-white focus:border-[#111]"
                    style={{ fontFamily: 'monospace' }}
                  />
                  {deleteError && (
                    <p className="text-center text-sm font-semibold" style={{ color: ACCENT }}>{deleteError}</p>
                  )}
                  <button type="submit"
                    disabled={isDeleting || deleteCode.length !== 6}
                    className="w-full h-12 rounded-xl font-bold text-[15px] text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: ACCENT }}>
                    {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
