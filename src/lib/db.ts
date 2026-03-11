import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SUPABASE_URL = 'https://gewoltwhitupkjbvosby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld29sdHdoaXR1cGtqYnZvc2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzMyNjcsImV4cCI6MjA4ODgwOTI2N30.ytR-2IEP2kZ2PpLSJZThxyofBd6oJWp351_A_FuBGlw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface StudentRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  school: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  timestamp: string;
}

export const db = {
  saveRecord: async (record: Omit<StudentRecord, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase.from('students').insert([
      {
        full_name: record.fullName,
        phone_number: record.phoneNumber,
        passport_number: record.passportNumber,
        school: record.school,
        next_of_kin_name: record.nextOfKinName,
        next_of_kin_phone: record.nextOfKinPhone,
      }
    ]).select().single();
    
    if (error) {
      console.error('Error saving record:', error);
      throw error;
    }
    return data;
  },

  getRecords: async (): Promise<StudentRecord[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching records:', error);
      return [];
    }
    
    return data.map((r: any) => ({
      id: r.id,
      fullName: r.full_name,
      phoneNumber: r.phone_number,
      passportNumber: r.passport_number,
      school: r.school,
      nextOfKinName: r.next_of_kin_name,
      nextOfKinPhone: r.next_of_kin_phone,
      timestamp: r.created_at,
    }));
  },

  exportToExcel: (records: StudentRecord[]) => {
    if (records.length === 0) { alert('No records to export.'); return; }

    const rows = records.map(r => ({
      'Full Name':           r.fullName,
      'Phone Number':        r.phoneNumber,
      'Passport Number':     r.passportNumber,
      'University (TRNC)':   r.school,
      'Next of Kin Name':    r.nextOfKinName,
      'Next of Kin Phone':   r.nextOfKinPhone,
      'Registration Date':   new Date(r.timestamp).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const colWidths = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length, 20) }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registry');
    XLSX.writeFile(wb, `kenyan_students_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportToPDF: (records: StudentRecord[]) => {
    if (records.length === 0) { alert('No records to export.'); return; }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Kenyan Students Registry — TRNC', 14, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Exported: ${new Date().toLocaleString()} · Total: ${records.length} student(s)`, 14, 25);
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 30,
      head: [['Full Name', 'Phone', 'Passport', 'University', 'Next of Kin', 'NK Phone', 'Date']],
      body: records.map(r => [
        r.fullName,
        r.phoneNumber,
        r.passportNumber,
        r.school,
        r.nextOfKinName,
        r.nextOfKinPhone,
        new Date(r.timestamp).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [200, 16, 46], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: 30 },
      alternateRowStyles: { fillColor: [250, 250, 248] },
      styles: { cellPadding: 3 },
    });

    doc.save(`kenyan_students_${new Date().toISOString().split('T')[0]}.pdf`);
  },
};
