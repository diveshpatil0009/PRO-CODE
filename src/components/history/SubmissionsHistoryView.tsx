import React, { useState } from 'react';
import {
  History,
  FileCheck2,
  CheckCircle2,
  Download,
  Copy,
  Clock,
  User,
  ShieldCheck,
  Search,
  ExternalLink,
  SplitSquareVertical,
} from 'lucide-react';
import { ContentSubmission } from '../../types/governance';

interface SubmissionsHistoryViewProps {
  submissions: ContentSubmission[];
  theme: 'dark' | 'light';
  onSelectSubmissionForStudio: (subId: string) => void;
}

export const SubmissionsHistoryView: React.FC<SubmissionsHistoryViewProps> = ({
  submissions,
  theme,
  onSelectSubmissionForStudio,
}) => {
  const isDark = theme === 'dark';
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];

  const handleCopy = () => {
    if (!selectedSub) return;
    navigator.clipboard.writeText(selectedSub.currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedSub) return;
    const element = document.createElement('a');
    const file = new Blob([selectedSub.currentText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedSub.title.replace(/\s+/g, '_')}_APPROVED.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className={`rounded-3xl p-6 border shadow-xl ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border-indigo-500/30'
            : 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Audit Trail & Version Control
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Item 8: Immutable Governance Ledger
              </span>
            </div>
            <h1
              className={`text-2xl font-extrabold mt-1 tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Document Revisions & Audit Log
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Complete historical record of drafts, automated analysis runs, human reviewer directives, and official publication approvals.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copied ? 'Copied!' : 'Copy Active Version'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-md shadow-cyan-400/20 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certified Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Submissions List + Version Diffs & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Submissions Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Document
            </div>

            <div className="space-y-2">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSubId(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    s.id === selectedSub.id
                      ? isDark
                        ? 'bg-slate-800 border-cyan-500/50 shadow-sm'
                        : 'bg-cyan-50/70 border-cyan-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                      {s.title}
                    </span>
                    <span className="font-mono text-cyan-400">{s.activeVersion}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {s.currentText}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                    <span>Status: {s.status.replace('_', ' ')}</span>
                    <span className="text-emerald-400 font-bold">{s.overallComplianceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Version Revisions & Audit Events */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Version Content & Diffs */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedSub.title}
                </h3>
                <div className="text-xs text-slate-400">
                  Version: <strong className="text-cyan-400 font-mono">{selectedSub.activeVersion}</strong> • Creator: {selectedSub.creatorName}
                </div>
              </div>

              <button
                onClick={() => onSelectSubmissionForStudio(selectedSub.id)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
              >
                <span>Open in Review Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Document Content Display */}
            <div
              className={`p-4 rounded-xl border font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {selectedSub.currentText}
            </div>
          </div>

          {/* Revisions & Audit Events Table */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Immutable Audit Events
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {selectedSub.auditHistory.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-400">{ev.action}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ev.timestamp.split('T')[0]} {ev.timestamp.split('T')[1]?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Actor: <span className="text-slate-200 font-medium">{ev.actor}</span> ({ev.actorRole}) • Version: {ev.version}
                  </div>
                  <div className="text-slate-300 text-[11px]">{ev.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
