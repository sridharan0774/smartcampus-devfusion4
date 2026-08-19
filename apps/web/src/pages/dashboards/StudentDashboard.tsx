import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  CalendarCheck,
  FileText,
  Calendar,
  Briefcase,
  AlertTriangle,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/attendance/summary').then(res => res.success && setAttendanceSummary(res.data));
    apiFetch('/api/assignments').then(res => res.success && setAssignments(res.data));
    apiFetch('/api/events').then(res => res.success && setEvents(res.data));
  }, []);

  const overallPct = attendanceSummary?.overallPercentage ?? 90;
  const isLow = attendanceSummary?.isLowAttendance;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back, {user?.name}! 👋</h1>
          <p className="text-xs text-brand-100 mt-1">Roll Number: {user?.rollNumber || 'CS2024-001'} | Semester {user?.semester || 6} | {user?.departmentName || 'Computer Science'}</p>
        </div>
        <Link to="/attendance">
          <Button variant="secondary" size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
            Scan Attendance QR
          </Button>
        </Link>
      </div>

      {/* Low Attendance Alert */}
      {isLow && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold">Low Attendance Warning (&lt;75%)</p>
              <p>Your current overall attendance is {overallPct}%. Please attend upcoming lectures to avoid exam hall ticket detention.</p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Attendance Rate"
          value={`${overallPct}%`}
          icon={<CalendarCheck className="w-5 h-5" />}
          trend={{ value: 'Above threshold', isPositive: overallPct >= 75 }}
          description="Requirement: 75%"
        />
        <StatCard
          title="Pending Submissions"
          value={assignments.filter(a => !a.mySubmission).length}
          icon={<FileText className="w-5 h-5" />}
          description="Due this week"
        />
        <StatCard
          title="Registered Events"
          value={events.filter(e => e.isRegistered).length}
          icon={<Calendar className="w-5 h-5" />}
          description="Upcoming on campus"
        />
        <StatCard
          title="Active Placements"
          value={3}
          icon={<Briefcase className="w-5 h-5" />}
          description="Open for application"
        />
      </div>

      {/* Charts & Tasks */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card title="Monthly Attendance Trend" className="lg:col-span-2">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Jan', rate: 94 },
                { month: 'Feb', rate: 88 },
                { month: 'Mar', rate: 92 },
                { month: 'Apr', rate: 96 },
                { month: 'May', rate: 85 },
                { month: 'Jun', rate: overallPct },
              ]}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Action List */}
        <Card title="Pending Assignment Deadlines">
          <div className="space-y-3">
            {assignments.slice(0, 4).map((assign) => (
              <div key={assign.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{assign.title}</p>
                  <p className="text-[11px] text-slate-500">Max Marks: {assign.maxMarks}</p>
                </div>
                <Badge variant={assign.mySubmission ? 'success' : 'warning'}>
                  {assign.mySubmission ? 'Submitted' : 'Pending'}
                </Badge>
              </div>
            ))}
            <Link to="/assignments" className="block text-center text-xs font-semibold text-brand-600 hover:underline pt-2">
              View All Assignments &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
