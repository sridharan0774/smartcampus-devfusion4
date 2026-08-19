import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Briefcase, Building, DollarSign, Upload, CheckCircle2 } from 'lucide-react';

export const PlacementsPage: React.FC = () => {
  const { user } = useAuth();
  const [placements, setPlacements] = useState<any[]>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    const res = await apiFetch('/api/placements');
    if (res.success) setPlacements(res.data);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;

    const formData = new FormData();
    if (resumeFile) formData.append('resume', resumeFile);

    try {
      const res = await apiFetch(`/api/placements/${selectedPlacement.id}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (res.success) {
        alert(res.message);
        setSelectedPlacement(null);
        fetchPlacements();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Career Placement Drives</h1>
        <p className="text-xs text-slate-500">Apply for leading tech company drives, upload resumes, and track live status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {placements.map((p) => (
          <Card key={p.id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-lg text-brand-600">
                  {p.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{p.jobRole}</h3>
                  <p className="text-xs text-slate-500">{p.companyName}</p>
                </div>
              </div>
              <Badge variant="success">{p.ctc}</Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{p.description}</p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 space-y-1">
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Eligibility:</span> {p.eligibility}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Deadline:</span> {new Date(p.deadline).toLocaleDateString()}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {p.hasApplied ? (
                <Badge variant="info">Status: {p.applicationStatus}</Badge>
              ) : (
                <Badge variant="warning">Open for Applications</Badge>
              )}

              {user?.role === 'STUDENT' && !p.hasApplied && (
                <Button size="sm" onClick={() => setSelectedPlacement(p)}>
                  Apply Now
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={!!selectedPlacement} onClose={() => setSelectedPlacement(null)} title={`Apply: ${selectedPlacement?.companyName}`}>
        <form onSubmit={handleApply} className="space-y-4">
          <p className="text-xs text-slate-500">Role: <span className="font-bold text-slate-900 dark:text-slate-100">{selectedPlacement?.jobRole}</span> ({selectedPlacement?.ctc})</p>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Upload PDF Resume</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
          <Button type="submit" className="w-full" leftIcon={<Upload className="w-4 h-4" />}>
            Submit Placement Application
          </Button>
        </form>
      </Modal>
    </div>
  );
};
