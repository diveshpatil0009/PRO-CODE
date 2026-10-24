import React, { useState } from 'react';
import {
  CheckCircle2,
  History,
  Copy,
  Download,
  Share2,
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Archive,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  ContentSubmission,
  LivingFact,
  AuditEvent,
  User,
} from '../../types/governance';

interface FinaliseAndMaintainProps {
  submission: ContentSubmission;
  facts: LivingFact[];
  onArchiveFact: (factId: string) => void;
  currentUser: User;
  onRestartWorkflow: () => void;
}

export const FinaliseAndMaintain: React.FC<FinaliseAndMaintainProps> = ({
  submission,
  facts,
  onArchiveFact,
  currentUser,
  onRestartWorkflow,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>(submission.activeVersion);

  const expiredFacts = facts.filter((f) => f.isExpired || f.status === 'expired');

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `# ${submission.title}\n\n` +
          `**Governance Status:** ${submission.status.toUpperCase()}\n` +
          `**Compliance Score:** ${submission.overallComplianceScore}%\n` +
          `**Approved Version:** ${submission.activeVersion}\n` +
          `**Certified By:** ${currentUser.name} (${currentUser.role})\n` +
          `**Date:** ${new Date().toISOString()}\n\n---\n\n` +
          `${submission.currentText}`,
      ],
      { type: 'text/markdown' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${submission.title.replace(/\s+/g, '_')}_APPROVED_${submission.activeVersion}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Publication Locker & Archival
              </span>
              <span className="text-xs text-slate-400">
                Certified Brand Asset Repository
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center space-x-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <span>Certified Publication Locker & Audit Trail</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              The content has been verified against living facts, brand tone, and vocabulary rules.
              Immutable revision history and authorized sign-off events are permanently recorded.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Content'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certified Markdown</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Approved Version Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Approved Publication Copy
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {submission.activeVersion}
                </span>
                <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Compliance: {submission.overallComplianceScore}%
                </span>
              </div>
            </div>

            {/* Approved Text Display */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {submission.currentText}
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Digital Governance Seal: </strong>
                  Ready for publishing across PR distribution channels and corporate CMS.
                </span>
              </div>
            </div>
          </div>

          {/* Outdated Facts Maintenance & Archiving Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Content Expiry Radar: Outdated Facts for Archiving
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {expiredFacts.length} Deprecated Metric
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Maintenance routine flags facts that have crossed expiry dates.
              Archive or update them to prevent other content creators from quoting stale stats.
            </p>

            <div className="space-y-2">
              {expiredFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-3 rounded-xl bg-slate-800/60 border border-red-500/30 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center space-x-2">
                      <span>{fact.topic}</span>
                      <span className="font-mono text-[10px] text-red-400 font-bold">
                        (EXPIRED on {fact.expiryDate})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Stat: <span className="line-through">{fact.approvedStatistic}</span> • Reference: {fact.sourceReference}
                    </div>
                  </div>

                  <button
                    onClick={() => onArchiveFact(fact.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium border border-slate-700 flex items-center space-x-1"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                    <span>Archive Fact</span>
                  </button>
                </div>
              ))}

              {expiredFacts.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs">
                  All living facts in the database are currently fresh and valid.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: FEATURE #12: VERSION HISTORY AND AUDIT TRAIL */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Version History & Audit Trail
                </h3>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                Feature #12
              </span>
            </div>

            {/* Version Pill Switcher */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Document Revisions Log
              </div>
              <div className="space-y-2">
                {submission.versions.map((ver) => (
                  <div
                    key={ver.versionNumber}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-400">
                        {ver.versionNumber}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        {ver.timestamp.split('T')[0]} {ver.timestamp.split('T')[1]?.slice(0, 5)}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">
                      Author: {ver.author} ({ver.authorRole})
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {ver.changeSummary}
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Compliance: {ver.complianceScore}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Immutable Governance Event Ledger
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {submission.auditHistory.map((event) => (
                  <div
                    key={event.id}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-200">{event.action}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {event.timestamp.split('T')[1]?.slice(0, 5) || 'Recent'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Actor: <span className="text-blue-300">{event.actor}</span> ({event.actorRole})
                    </div>
                    <div className="text-[11px] text-slate-300">{event.details}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* New workflow trigger */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={onRestartWorkflow}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Review Another Document or Create New Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
