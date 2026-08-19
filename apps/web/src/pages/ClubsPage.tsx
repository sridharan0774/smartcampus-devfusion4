import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Users, UserPlus } from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const res = await apiFetch('/api/clubs');
    if (res.success) setClubs(res.data);
  };

  const handleJoin = async (clubId: string) => {
    try {
      const res = await apiFetch(`/api/clubs/${clubId}/join`, { method: 'POST' });
      if (res.success) {
        alert(res.message);
        fetchClubs();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Organizations &amp; Clubs</h1>
        <p className="text-xs text-slate-500">Explore technical, robotics, and cultural societies across campus.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {clubs.map((c) => (
          <Card key={c.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="info">{c.category}</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5" /> {c.memberCount} Members
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {c.membershipStatus === 'APPROVED' ? (
                <Badge variant="success">Active Member</Badge>
              ) : user?.role === 'STUDENT' ? (
                <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => handleJoin(c.id)}>
                  Join Guild
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
