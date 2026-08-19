import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { FileText, Upload, Plus, Github, ExternalLink, CheckCircle2 } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState(100);

  const isFaculty = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await apiFetch('/api/assignments');
    if (res.success) setAssignments(res.data);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const formData = new FormData();
    formData.append('assignmentId', selectedAssignment.id);
    if (githubUrl) formData.append('githubUrl', githubUrl);
    if (file) formData.append('file', file);

    try {
      const res = await apiFetch('/api/assignments/submit', {
        method: 'POST',
        body: formData,
      });

      if (res.success) {
        alert(res.message);
        setSelectedAssignment(null);
        fetchAssignments();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          subjectId: newSubjectId,
          deadline: newDeadline,
          maxMarks: Number(newMaxMarks),
        }),
      });

      if (res.success) {
        alert('Assignment published successfully!');
        setIsCreateModalOpen(false);
        fetchAssignments();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Assignments &amp; Submissions</h1>
          <p className="text-xs text-slate-500">Submit PDF/ZIP solutions or GitHub links. Rubrics and deadline enforcement enabled.</p>
        </div>
        {isFaculty && (
          <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {assignments.map((a) => {
          const isLate = new Date() > new Date(a.deadline);
          const hasSubmitted = !!a.mySubmission;

          return (
            <Card key={a.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{a.subject?.name || 'Computer Science'}</Badge>
                  <span className="text-xs font-semibold text-slate-500">Max Marks: {a.maxMarks}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{a.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Deadline: <span className={isLate ? 'text-rose-500 font-semibold' : 'font-semibold'}>{new Date(a.deadline).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {hasSubmitted ? (
                  <Badge variant="success">Submitted ({a.mySubmission?.status})</Badge>
                ) : (
                  <Badge variant={isLate ? 'danger' : 'warning'}>{isLate ? 'LATE' : 'PENDING'}</Badge>
                )}

                {user?.role === 'STUDENT' && (
                  <Button
                    size="sm"
                    variant={hasSubmitted ? 'outline' : 'primary'}
                    onClick={() => setSelectedAssignment(a)}
                  >
                    {hasSubmitted ? 'Update Submission' : 'Submit Solution'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Student Submit Solution Modal */}
      <Modal isOpen={!!selectedAssignment} onClose={() => setSelectedAssignment(null)} title={`Submit: ${selectedAssignment?.title}`}>
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          <Input
            label="GitHub Repository URL (Optional)"
            placeholder="https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            leftIcon={<Github className="w-4 h-4" />}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Upload PDF / ZIP Solution</label>
            <input
              type="file"
              accept=".pdf,.zip,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <Button type="submit" className="w-full" leftIcon={<Upload className="w-4 h-4" />}>
            Upload &amp; Confirm Submission
          </Button>
        </form>
      </Modal>

      {/* Faculty Create Assignment Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Publish New Assignment">
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input label="Assignment Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Detailed Description &amp; Instructions</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-white"
              required
            />
          </div>
          <Input label="Subject UUID" value={newSubjectId} onChange={(e) => setNewSubjectId(e.target.value)} placeholder="e.g. Subject ID" required />
          <Input label="Deadline Date/Time" type="datetime-local" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} required />
          <Input label="Max Marks" type="number" value={newMaxMarks} onChange={(e) => setNewMaxMarks(Number(e.target.value))} required />
          <Button type="submit" className="w-full">Publish to Class</Button>
        </form>
      </Modal>
    </div>
  );
};
