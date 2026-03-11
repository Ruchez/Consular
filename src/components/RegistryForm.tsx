import React, { useState } from 'react';
import { db } from '../lib/db';
import { TRNC_UNIVERSITIES } from '../lib/universities';
import { User, Phone, FileText, School, Heart, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ACCENT = '#C8102E';
const ACCENT_HOVER = '#A50D26';

const inputCls = "w-full h-12 border border-[#E8E8E4] rounded-xl px-4 text-[15px] font-medium text-[#111] bg-[#F7F7F5] outline-none transition-all placeholder:text-[#BDBDBD] focus:bg-white focus:border-[#111]";
const labelCls = "block text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A] mb-1.5";

export const RegistryForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', passportNumber: '',
    school: '', nextOfKinName: '', nextOfKinPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.saveRecord(formData);
      setSubmitted(true);
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setFormData({ fullName: '', phoneNumber: '', passportNumber: '', school: '', nextOfKinName: '', nextOfKinPhone: '' });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white border border-[#E8E8E4] rounded-2xl shadow-sm p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
             style={{ background: '#F0FBF0' }}>
          <CheckCircle2 size={36} style={{ color: '#006600' }} />
        </div>
        <h2 className="text-2xl font-bold text-[#111] mb-2">Registration Received</h2>
        <p className="text-[#8A8A8A] text-[15px] mb-8 max-w-xs mx-auto">
          Your details have been securely logged with the Kenyan Consular Office.
        </p>
        <button
          onClick={() => { setSubmitted(false); reset(); }}
          onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
          className="w-full h-12 rounded-xl text-[15px] font-bold text-white transition-colors"
          style={{ background: ACCENT }}>
          Register Another Person
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white border border-[#E8E8E4] rounded-2xl shadow-sm overflow-hidden"
    >
      <form onSubmit={handleSubmit}>

        {/* ── Personal Info ── */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-[3px] h-5 rounded-full block" style={{ background: '#C8102E' }} />
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#C8102E]">Personal Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className={labelCls}>Full Name — as on passport</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3.5 text-[#BDBDBD]" />
                <input required className={inputCls + " pl-9"} placeholder="JOHN DOE"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Phone Number <span className="normal-case font-normal text-[#BDBDBD]">(TRNC or Kenyan)</span></label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3.5 text-[#BDBDBD]" />
                <input required className={inputCls + " pl-9"} placeholder="+90 5XX … or +254 7XX …"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Passport Number</label>
              <div className="relative">
                <FileText size={15} className="absolute left-3.5 top-3.5 text-[#BDBDBD]" />
                <input required className={inputCls + " pl-9"} placeholder="A1234567"
                  value={formData.passportNumber}
                  onChange={e => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })} />
              </div>
            </div>

            <div>
              <label className={labelCls}>University (TRNC)</label>
              <div className="relative">
                <School size={15} className="absolute left-3.5 top-3.5 text-[#BDBDBD]" />
                <ChevronDown size={15} className="absolute right-3.5 top-3.5 text-[#BDBDBD] pointer-events-none" />
                <select required className={inputCls + " pl-9 pr-9 appearance-none"}
                  value={formData.school}
                  onChange={e => setFormData({ ...formData, school: e.target.value })}>
                  <option value="">Select University…</option>
                  {TRNC_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-8 border-t border-[#F0F0EE]" />

        {/* ── Next of Kin ── */}
        <div className="p-8 pt-6">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-[3px] h-5 rounded-full block" style={{ background: '#006600' }} />
            <span className="text-[13px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#006600' }}>
              <Heart size={13} /> Next of Kin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name</label>
              <input required className={inputCls} placeholder="Emergency Contact Name"
                value={formData.nextOfKinName}
                onChange={e => setFormData({ ...formData, nextOfKinName: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input required className={inputCls} placeholder="+254 7XX XXX XXX"
                value={formData.nextOfKinPhone}
                onChange={e => setFormData({ ...formData, nextOfKinPhone: e.target.value })} />
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="px-8 pb-8">
          <button type="submit"
            disabled={loading}
            onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
            className="w-full h-14 rounded-xl text-[16px] font-bold text-white tracking-wide transition-colors active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: ACCENT }}>
            {loading ? "Registering..." : "Complete Registration →"}
          </button>
          <p className="text-center text-[11px] text-[#BDBDBD] mt-4 uppercase tracking-widest font-semibold">
            Encrypted · Kenyan Consular Office
          </p>
        </div>

      </form>
    </motion.div>
  );
};
