import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, FileText, QrCode, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/attendance/faculty-sessions').then(res => res.success && setSessions(res.data));
    apiFetch('/api/assignments').then(res => res.success && setAssignments(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faculty Portal — {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Department of {user?.departmentName || 'Computer Science'}</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/attendance">
            <Button size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
              Create Session
            </Button>
          </Link>
          <Link to="/assignments">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-200" leftIcon={<Plus className="w-4 h-4" />}>
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Active Classes Taught"
          value="4 Subjects"
          icon={<Users className="w-5 h-5" />}
          description="CS301, CS302, CS303"
        />
        <StatCard
          title="Attendance Sessions"
          value={sessions.length}
          icon={<QrCode className="w-5 h-5" />}
          description="Conducted this term"
        />
        <StatCard
          title="Published Assignments"
          value={assignments.length}
          icon={<FileText className="w-5 h-5" />}
          description="Pending reviews"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card title="Recent Attendance Sessions">
          <div className="space-y-3">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{s.subject?.name}</p>
                  <p className="text-[11px] text-slate-500">{new Date(s.date).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-brand-600">{s._count?.records || 0} Students Marked</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Assignment Submissions & Reviews">
          <div className="space-y-3">
            {assignments.slice(0, 5).map((a) => (
              <div key={a.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</p>
                  <p className="text-[11px] text-slate-500">Deadline: {new Date(a.deadline).toLocaleDateString()}</p>
                </div>
                <Link to="/assignments">
                  <Button size="sm" variant="ghost">Review ({a._count?.submissions || 0})</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
