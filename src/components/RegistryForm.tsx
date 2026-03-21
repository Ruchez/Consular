import React, { useState } from 'react';
import { db } from '../lib/db';
import { TRNC_UNIVERSITIES } from '../lib/universities';
import { User, Phone, FileText, School, Heart, CheckCircle2, ChevronDown } from 'lucide-react';

const ACCENT = '#C8102E';

const inputCls = "w-full h-12 border border-[#D2D2D7] rounded-2xl px-4 text-[15px] font-medium text-[#1D1D1F] bg-[#F5F5F7] outline-none transition-colors placeholder:text-[#86868B] focus:bg-white focus:border-[#1D1D1F]";
const labelCls = "block text-[12px] font-bold tracking-tight text-[#1D1D1F] mb-2";

export const RegistryForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', passportNumber: '',
    school: '', nextOfKinName: '', nextOfKinPhone: '',
  });

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await db.saveRecord(formData);
      setStep('success');
    } catch (err: any) {
      if (err.message === 'DUPLICATE_PASSPORT') {
        alert("This passport number is already registered. Please check your details.");
        setStep('form');
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData({ fullName: '', phoneNumber: '', passportNumber: '', school: '', nextOfKinName: '', nextOfKinPhone: '' });
    setStep('form');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white border border-[#D2D2D7]/30 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] p-12 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
             style={{ background: '#F0FBF0' }}>
          <CheckCircle2 size={36} style={{ color: '#006600' }} />
        </div>
        <h2 className="text-3xl font-bold text-[#1D1D1F] mb-3">All set.</h2>
        <p className="text-[#86868B] text-[16px] mb-10 max-w-xs mx-auto font-medium leading-relaxed">
          Your details have been securely logged with the Consular Office.
        </p>
        <button
          onClick={reset}
          className="w-full h-14 rounded-2xl text-[16px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: '#1D1D1F' }}>
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D2D2D7]/30 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      <>
        {step === 'form' && (
          <form onSubmit={handleReview}>

        {/* ── Personal Info ── */}
        <div className="p-6 md:p-8 pb-6">
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
                  pattern="^\+.*"
                  title="Phone number must start with a '+' sign"
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
        <div className="mx-6 md:mx-10 border-t border-[#F5F5F7]" />

        {/* ── Next of Kin ── */}
        <div className="p-6 md:p-8 pt-6">
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
                pattern="^\+.*"
                title="Phone number must start with a '+' sign"
                value={formData.nextOfKinPhone}
                onChange={e => setFormData({ ...formData, nextOfKinPhone: e.target.value })} />
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="px-6 md:px-10 pb-10 mt-6">
          <button type="submit"
            className="w-full h-14 rounded-2xl text-[16px] font-bold text-white tracking-tight transition-opacity hover:opacity-90 active:scale-[0.99]"
            style={{ background: '#1D1D1F' }}>
            Continue →
          </button>
        </div>

      </form>
      )}

      {step === 'confirm' && (
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1D1D1F]">Review Details</h2>
            <p className="text-[15px] text-[#86868B] mt-1.5 font-medium">Verify your information before submission.</p>
          </div>

          <div className="bg-[#F5F5F7] rounded-[24px] p-6 md:p-8 space-y-6 mb-10 border border-[#D2D2D7]/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1">Full Name</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{formData.fullName}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1">Passport Number</p>
                <p className="text-[16px] font-mono font-bold" style={{ color: ACCENT }}>{formData.passportNumber}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1">Phone Number</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{formData.phoneNumber}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1">University</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{formData.school}</p>
              </div>
            </div>
            
            <div className="border-t border-[#D2D2D7]/50" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1 flex items-center gap-1.5 uppercase">Next of Kin Name</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{formData.nextOfKinName}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#86868B] tracking-tight mb-1 flex items-center gap-1.5 uppercase">Next of Kin Phone</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{formData.nextOfKinPhone}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <button 
              onClick={() => setStep('form')}
              disabled={loading}
              className="flex-1 h-14 rounded-2xl text-[16px] font-bold text-[#1D1D1F] bg-[#E5E5EA] hover:bg-[#D1D1D6] transition-colors disabled:opacity-50">
              Edit
            </button>
            <button 
              onClick={handleFinalSubmit}
              disabled={loading}
              className="flex-[2] h-14 rounded-2xl text-[16px] font-bold text-white tracking-tight transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: '#1D1D1F' }}>
              {loading ? "Registering..." : "Confirm & Submit"}
            </button>
          </div>
        </div>
      )}
      </>
    </div>
  );
};
