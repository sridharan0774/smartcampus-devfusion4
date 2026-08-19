import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, Users, Briefcase, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/events').then(res => res.success && setEvents(res.data));
    apiFetch('/api/clubs').then(res => res.success && setClubs(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coordinator Portal — {user?.name}</h1>
          <p className="text-xs text-indigo-200 mt-1">Campus Events, Clubs &amp; Student Affairs Administration</p>
        </div>
        <Link to="/events">
          <Button size="sm" className="bg-white text-indigo-900 hover:bg-slate-100" leftIcon={<Plus className="w-4 h-4" />}>
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Campus Events"
          value={events.length}
          icon={<Calendar className="w-5 h-5" />}
          description="Active &amp; upcoming"
        />
        <StatCard
          title="Student Clubs"
          value={clubs.length}
          icon={<Users className="w-5 h-5" />}
          description="Registered organizations"
        />
        <StatCard
          title="Placement Drives"
          value="2 Open"
          icon={<Briefcase className="w-5 h-5" />}
          description="Coordination active"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card title="Campus Events &amp; Registration Counts">
          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{ev.title}</p>
                  <p className="text-[11px] text-slate-500">Venue: {ev.venue} | Seats Left: {ev.availableSeats}/{ev.maxSeats}</p>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{ev._count?.registrations || 0} Registered</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Managed Student Clubs">
          <div className="space-y-3">
            {clubs.map((c) => (
              <div key={c.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</p>
                  <p className="text-[11px] text-slate-500">Category: {c.category}</p>
                </div>
                <span className="font-bold text-emerald-600">{c.memberCount || 0} Members</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
