import React, { useState, useRef, useEffect } from 'react';
import { db } from '../lib/db';
import type { StudentRecord } from '../lib/db';
import { Search, LogOut, ShieldCheck, ChevronDown, FileSpreadsheet, FileText, Trash2, X } from 'lucide-react';

// Single brand accent color — used for all primary actions
const ACCENT = '#C8102E';

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
    <div className="space-y-8">

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
          {selectedIds.size > 0 && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}>
              <Trash2 size={14} /> Delete ({selectedIds.size})
            </button>
          )}

          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(v => !v)}
              className="flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: '#1D1D1F' }}>
              Export <ChevronDown size={14} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
            </button>

            {exportOpen && (
              <div className="absolute right-0 top-12 z-30 bg-white border border-[#D2D2D7]/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden w-48">
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors">
                  <FileSpreadsheet size={16} style={{ color: '#006600' }} /> Export Excel
                </button>
                <div className="border-t border-[#F5F5F7]" />
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors">
                  <FileText size={16} style={{ color: ACCENT }} /> Export PDF
                </button>
              </div>
            )}
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
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" />
        <input
          className="w-full h-12 border border-[#D2D2D7] rounded-2xl pl-11 pr-4 text-[14px] font-medium text-[#1D1D1F] bg-white outline-none transition-colors placeholder:text-[#86868B] focus:border-[#1D1D1F]"
          placeholder="Search records…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#D2D2D7]/30 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#F5F5F7] bg-[#FAFAF9]">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    disabled={filtered.length === 0}
                    className="w-4 h-4 rounded-md border-[#D2D2D7] text-[#1D1D1F] focus:ring-[#1D1D1F]"
                  />
                </th>
                {[
                  'Full Name', 'Phone', 'Passport', 'University',
                  'Next of Kin', 'NK Phone', 'Date'
                ].map((h, i) => (
                  <th key={h}
                    className={`px-6 py-4 text-[11px] font-bold tracking-tight text-[#86868B] whitespace-nowrap ${i === 6 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {filtered.map(r => (
                <tr key={r.id} className={`hover:bg-[#F5F5F7]/50 transition-colors ${selectedIds.has(r.id) ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="w-4 h-4 rounded-md border-[#D2D2D7] text-[#1D1D1F] focus:ring-[#1D1D1F]"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1D1D1F] whitespace-nowrap">{r.fullName}</td>
                  <td className="px-6 py-4 text-[#424245] whitespace-nowrap">{r.phoneNumber}</td>
                  <td className="px-6 py-4 font-mono font-bold whitespace-nowrap" style={{ color: ACCENT }}>{r.passportNumber}</td>
                  <td className="px-6 py-4 text-[#424245] max-w-[180px] truncate">{r.school}</td>
                  <td className="px-6 py-4 text-[#424245] whitespace-nowrap">{r.nextOfKinName}</td>
                  <td className="px-6 py-4 text-[#86868B] whitespace-nowrap">{r.nextOfKinPhone}</td>
                  <td className="px-6 py-4 text-[#86868B] text-right font-mono text-xs whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={8} className="py-24 text-center">
                    <p className="text-[#86868B] font-medium text-sm">Loading database...</p>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[#86868B] font-medium text-sm">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Deletion Modal ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm"
               onClick={() => !isDeleting && setDeleteModalOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-[#D2D2D7]/50 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50">
                  <Trash2 size={22} style={{ color: ACCENT }} />
                </div>
                <button onClick={() => !isDeleting && setDeleteModalOpen(false)} className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                  <X size={22} />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2 leading-tight">Delete {selectedIds.size} Record{selectedIds.size !== 1 ? 's' : ''}?</h3>
              <p className="text-[15px] text-[#86868B] mb-8 font-medium">
                This action cannot be undone. Enter the access code to confirm.
              </p>

              <form onSubmit={handleDelete} className="space-y-4">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  placeholder="••••••"
                  value={deleteCode}
                  onChange={e => setDeleteCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-14 border border-[#D2D2D7] rounded-2xl px-4 text-center text-2xl font-bold tracking-[0.4em] outline-none bg-[#F5F5F7] focus:bg-white focus:border-[#1D1D1F]"
                  style={{ fontFamily: 'monospace' }}
                />
                {deleteError && (
                  <p className="text-center text-[13px] font-bold" style={{ color: ACCENT }}>{deleteError}</p>
                )}
                <button type="submit"
                  disabled={isDeleting || deleteCode.length !== 6}
                  className="w-full h-14 rounded-2xl font-bold text-[16px] text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#1D1D1F' }}>
                  {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
