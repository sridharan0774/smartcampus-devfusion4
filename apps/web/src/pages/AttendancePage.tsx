import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { CalendarCheck, QrCode, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [createdSession, setCreatedSession] = useState<any>(null);

  const isFaculty = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await apiFetch('/api/attendance/summary');
      if (res.success) setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQRScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage('');
    try {
      const res = await apiFetch('/api/attendance/qr-scan', {
        method: 'POST',
        body: JSON.stringify({ qrToken: qrInput }),
      });
      if (res.success) {
        setScanMessage(res.message);
        fetchSummary();
        setTimeout(() => setIsScannerOpen(false), 2000);
      }
    } catch (err: any) {
      setScanMessage(`Error: ${err.message}`);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/attendance/sessions', {
        method: 'POST',
        body: JSON.stringify({ subjectId }),
      });
      if (res.success) {
        setCreatedSession(res.data);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Attendance Management</h1>
          <p className="text-xs text-slate-500">Track subject attendance, calculate overall percentages, and scan session QR tokens.</p>
        </div>
        {!isFaculty ? (
          <Button onClick={() => setIsScannerOpen(true)} leftIcon={<QrCode className="w-4 h-4" />}>
            Scan QR Code
          </Button>
        ) : (
          <Button onClick={() => setIsFacultyModalOpen(true)} leftIcon={<CalendarCheck className="w-4 h-4" />}>
            New Class Session
          </Button>
        )}
      </div>

      {/* Warning threshold notification */}
      {summary?.isLowAttendance && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-bold">Low Attendance Alert (&lt;75%)</p>
            <p>Your current attendance is {summary?.overallPercentage}%. Maintain at least 75% to sit for end-semester exams.</p>
          </div>
        </div>
      )}

      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-slate-500 uppercase font-semibold">Overall Rate</p>
          <p className="text-3xl font-extrabold text-brand-600 mt-1">{summary?.overallPercentage ?? 90}%</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 uppercase font-semibold">Present Sessions</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{summary?.presentCount ?? 9}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 uppercase font-semibold">Absent Sessions</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">{summary?.absentCount ?? 1}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 uppercase font-semibold">Late Sessions</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{summary?.lateCount ?? 0}</p>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card title="Subject Attendance Percentage Breakdown">
        <div className="space-y-3">
          {summary?.subjectBreakdown?.map((sub: any, i: number) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">{sub.subjectName}</span>
                <span className={sub.percentage >= 75 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {sub.percentage}% ({sub.present}/{sub.total})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Attendance History Table */}
      <Card title="Recent Attendance Log">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Faculty</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summary?.records?.map((r: any) => (
                <tr key={r.id}>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">{r.session?.subject?.name}</td>
                  <td className="py-3 px-3 text-slate-500">{r.session?.faculty?.name}</td>
                  <td className="py-3 px-3 text-slate-500">{new Date(r.session?.date).toLocaleDateString()}</td>
                  <td className="py-3 px-3">
                    <Badge variant={r.status === 'PRESENT' ? 'success' : 'danger'}>{r.status}</Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Scanner / Input Modal */}
      <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Scan Class QR Code">
        <form onSubmit={handleQRScanSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">Enter or scan the dynamic session QR token displayed on the classroom screen:</p>
          <Input
            placeholder="e.g. QR-SESS-WEBDEV-1-170000000"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            required
          />
          {scanMessage && <p className="text-xs font-semibold text-brand-600">{scanMessage}</p>}
          <Button type="submit" className="w-full">Confirm Attendance</Button>
        </form>
      </Modal>

      {/* Faculty Create Session Modal */}
      <Modal isOpen={isFacultyModalOpen} onClose={() => setIsFacultyModalOpen(false)} title="Create Class Attendance Session">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Input
            label="Subject ID"
            placeholder="Enter Subject UUID (e.g. CS301)"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Generate QR Token</Button>

          {createdSession && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center space-y-2 mt-4">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Session Token Active</p>
              <p className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded text-brand-600 font-bold">{createdSession.qrCodeToken}</p>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
