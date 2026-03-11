import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const STORAGE_KEY = 'kenyan_registry_data';

export const db = {
  saveRecord: (record: Omit<StudentRecord, 'id' | 'timestamp'>) => {
    const records = db.getRecords();
    const newRecord: StudentRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  },

  getRecords: (): StudentRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  exportToExcel: () => {
    const records = db.getRecords();
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
    // Auto-width columns
    const colWidths = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length, 20) }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registry');
    XLSX.writeFile(wb, `kenyan_students_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportToPDF: () => {
    const records = db.getRecords();
    if (records.length === 0) { alert('No records to export.'); return; }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
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
