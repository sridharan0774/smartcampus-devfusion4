import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileSpreadsheet, Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const downloadReport = (type: 'attendance' | 'placements', format: 'csv' | 'excel') => {
    window.open(`/api/reports/${type}?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Institutional Reports &amp; Exports</h1>
        <p className="text-xs text-slate-500">Download formatted CSV and Excel spreadsheets generated directly from PostgreSQL data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Campus Attendance Records Report">
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">Includes student roll numbers, subject codes, dates, present/absent statuses, and faculty remarks.</p>
            <div className="flex space-x-3">
              <Button size="sm" onClick={() => downloadReport('attendance', 'csv')} leftIcon={<Download className="w-4 h-4" />}>
                Export CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => downloadReport('attendance', 'excel')} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Export Excel (.xlsx)
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Placement Drive &amp; Applications Report">
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">Includes student details, company names, job roles, packages (CTC), and current application statuses.</p>
            <div className="flex space-x-3">
              <Button size="sm" onClick={() => downloadReport('placements', 'csv')} leftIcon={<Download className="w-4 h-4" />}>
                Export CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => downloadReport('placements', 'excel')} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Export Excel (.xlsx)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
