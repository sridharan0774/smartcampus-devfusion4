import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Shield, Search, Trash2, Edit3, ShieldAlert } from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('STUDENT');

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, [search]);

  const fetchUsers = async () => {
    const res = await apiFetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
    if (res.success) setUsers(res.data.users);
  };

  const fetchLogs = async () => {
    const res = await apiFetch('/api/admin/logs');
    if (res.success) setLogs(res.data);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const res = await apiFetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.success) {
        alert(`Assigned ${newRole} role to ${selectedUser.name}`);
        setSelectedUser(null);
        fetchUsers();
        fetchLogs();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user ${name}? This action creates an audit log.`)) return;

    try {
      const res = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.success) {
        alert(res.message);
        fetchUsers();
        fetchLogs();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Administrator Governance Panel</h1>
          <p className="text-xs text-slate-500">Manage user accounts, assign server RBAC roles, and view immutable audit trails.</p>
        </div>
      </div>

      {/* User Management Table */}
      <Card title="User Accounts Management">
        <div className="mb-4">
          <Input
            placeholder="Search by student/faculty name, email, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Current Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                  <td className="py-3 px-3 text-slate-500">{u.email}</td>
                  <td className="py-3 px-3">
                    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'FACULTY' ? 'warning' : 'info'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{u.department?.name || '—'}</td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(u); setNewRole(u.role); }}>
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u.id, u.name)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Immutable Audit Logs Viewer */}
      <Card title="System Audit &amp; Activity Logs">
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-slate-100">{log.action}</span>
                <span className="text-slate-500"> on {log.resource} by </span>
                <span className="font-semibold text-brand-600">{log.user?.name || log.userId}</span>
                <p className="text-[11px] text-slate-400">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Assign Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={`Assign Role: ${selectedUser?.name}`}>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Select Server Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="COORDINATOR">COORDINATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <Button onClick={handleRoleUpdate} className="w-full">
            Save Role Assignment
          </Button>
        </div>
      </Modal>
    </div>
  );
};
