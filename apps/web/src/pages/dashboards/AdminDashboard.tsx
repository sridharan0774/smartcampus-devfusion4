import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Users, GraduationCap, Building, Calendar, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/analytics/dashboard').then(res => res.success && setStats(res.data));
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Full System Governance &amp; Administration</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Portal — {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Realtime telemetry, user management, audit trails, and global reports</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin">
            <Button size="sm" variant="primary">Manage Users &amp; Roles</Button>
          </Link>
          <Link to="/reports">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-200" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 21}
          icon={<GraduationCap className="w-5 h-5" />}
          description="Active accounts"
        />
        <StatCard
          title="Total Faculty"
          value={stats?.totalFaculty ?? 5}
          icon={<Users className="w-5 h-5" />}
          description="Professors &amp; Instructors"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments ?? 3}
          icon={<Building className="w-5 h-5" />}
          description="CSE, ECE, ME"
        />
        <StatCard
          title="Overall Attendance"
          value={`${stats?.overallAttendancePercentage ?? 92}%`}
          icon={<Calendar className="w-5 h-5" />}
          description="Campus-wide average"
        />
      </div>

      {/* Recharts System Metrics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card title="Department Attendance &amp; Marks Performance">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.departmentPerformance || [
                { department: 'CSE', averageMarks: 88, attendanceRate: 94 },
                { department: 'ECE', averageMarks: 82, attendanceRate: 90 },
                { department: 'ME', averageMarks: 79, attendanceRate: 86 },
              ]}>
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="attendanceRate" fill="#2563eb" name="Attendance Rate %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="averageMarks" fill="#10b981" name="Avg Marks %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Assignment Completion Breakdown">
          <div className="h-64 w-full flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.assignmentCompletion || [
                    { name: 'Completed On-Time', value: 18 },
                    { name: 'Submitted Late', value: 3 },
                    { name: 'Pending Review', value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.assignmentCompletion?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
