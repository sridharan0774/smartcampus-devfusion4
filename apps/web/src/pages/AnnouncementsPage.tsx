import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Megaphone, Plus, Bell } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const canPublish = user?.role === 'FACULTY' || user?.role === 'COORDINATOR' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await apiFetch('/api/announcements');
    if (res.success) setAnnouncements(res.data);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/announcements', {
        method: 'POST',
        body: JSON.stringify({ title, content, priority }),
      });
      if (res.success) {
        alert('Announcement published to campus network!');
        setIsModalOpen(false);
        fetchAnnouncements();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Campus Network Announcements</h1>
          <p className="text-xs text-slate-500">Official broadcasts filtered by department, role, and priority level.</p>
        </div>
        {canPublish && (
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Publish Notice
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={a.priority === 'URGENT' ? 'danger' : a.priority === 'HIGH' ? 'warning' : 'info'}>
                  {a.priority} PRIORITY
                </Badge>
                <span className="text-xs text-slate-500">Posted by: {a.author?.name} ({a.author?.role})</span>
              </div>
              <span className="text-xs text-slate-400">{new Date(a.publishDate).toLocaleString()}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{a.content}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Official Notice">
        <form onSubmit={handlePublish} className="space-y-4">
          <Input label="Notice Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Notice Body</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
          <Button type="submit" className="w-full" leftIcon={<Megaphone className="w-4 h-4" />}>
            Broadcast Notice
          </Button>
        </form>
      </Modal>
    </div>
  );
};
