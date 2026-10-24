import React from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  ShieldCheck,
  UserCheck,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ContentSubmission,
  GovernanceMetrics,
  LivingFact,
  User,
} from '../../types/governance';

interface ExecutiveDashboardProps {
  submissions: ContentSubmission[];
  metrics: GovernanceMetrics;
  facts: LivingFact[];
  currentUser: User;
  theme: 'dark' | 'light';
  onGoToReviewStudio: (subId?: string) => void;
  onGoToKnowledgeBase: () => void;
  onGoToWorkflow: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  submissions,
  metrics,
  facts,
  currentUser,
  theme,
  onGoToReviewStudio,
  onGoToKnowledgeBase,
  onGoToWorkflow,
}) => {
  const isDark = theme === 'dark';

  const pendingApprovals = submissions.filter(
    (s) => s.status === 'under_review' || s.status === 'draft'
  );
  const totalIssuesDetected = submissions.reduce(
    (acc, curr) => acc + curr.findings.filter((f) => !f.applied).length,
    0
  );
  const contentNeedingUpdates = facts.filter((f) => f.isExpired || f.isExpiringSoon).length;

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Actions Bar */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border-blue-500/30'
            : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-blue-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Brand Governance HQ
              </span>
              <span
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Role: <strong className="text-blue-500">{currentUser.name}</strong> ({currentUser.role})
              </span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Enterprise Brand Consistency Dashboard
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Real-time monitoring of content items, brand rule compliance, pending reviewer sign-offs, and living fact freshness before public release.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onGoToReviewStudio()}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow-lg shadow-cyan-400/25 flex items-center space-x-2 transition active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Review Studio</span>
            </button>

            <button
              onClick={onGoToKnowledgeBase}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1.5 text-blue-500" />
              <span>Upload Guidelines</span>
            </button>

            <button
              onClick={onGoToWorkflow}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1.5 text-indigo-500" />
              <span>7-Step Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards (Item 1 in User Request) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Content Items Reviewed */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Reviewed</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div
            className={`text-3xl font-black font-mono ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {metrics.totalContentReviewed}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% this month</span>
          </div>
        </div>

        {/* Issues Detected */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Issues</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black font-mono text-red-500">
            {totalIssuesDetected}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across current submission queue
          </div>
        </div>

        {/* Pending Approvals */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-500">
            {pendingApprovals.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting authorized sign-off
          </div>
        </div>

        {/* Content / Facts Needing Updates */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Stale / Expired Facts</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-500">
            {contentNeedingUpdates}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fact Expiry Radar alert active
          </div>
        </div>
      </div>

      {/* Two Column Grid: Content Queue + Recent Activity Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Content Review Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <h3
                className={`text-base font-bold flex items-center space-x-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <span>Active Content Governance Queue</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {submissions.length} items
              </span>
            </div>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onGoToReviewStudio(sub.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/70'
                      : 'bg-slate-50/80 border-slate-200 hover:border-cyan-500 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {sub.activeVersion}
                        </span>
                        <span
                          className={`text-sm font-bold group-hover:text-cyan-400 transition ${
                            isDark ? 'text-slate-200' : 'text-slate-900'
                          }`}
                        >
                          {sub.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {sub.currentText}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          sub.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : sub.status === 'changes_requested'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                      <div className="font-mono text-xs font-bold text-slate-300 mt-1">
                        Score: {sub.overallComplianceScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[11px] text-slate-400">
                    <span>
                      Author: <strong className="text-slate-300">{sub.creatorName}</strong> • {sub.contentType}
                    </span>
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                      <span>Open in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (Item 1 in User Request) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <h3
                className={`text-base font-bold flex items-center space-x-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <Activity className="w-5 h-5 text-indigo-400" />
                <span>Recent Audit Activity</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {[
                {
                  actor: 'Brand Director',
                  role: 'Brand Governance Director',
                  action: 'Final Approval Signed',
                  time: '12 mins ago',
                  target: 'Q3 Enterprise Launch Press Release v2.0',
                  badge: 'Approved',
                  color: 'emerald',
                },
                {
                  actor: 'Compliance Reviewer',
                  role: 'Lead Compliance Reviewer',
                  action: 'Editorial Changes Requested',
                  time: '34 mins ago',
                  target: 'Flagged expired 1.2M user stat and discount slang',
                  badge: 'Changes',
                  color: 'amber',
                },
                {
                  actor: 'Senior Copywriter',
                  role: 'Content Creator',
                  action: 'Draft Submitted for Scan',
                  time: '1 hour ago',
                  target: 'Global LATAM Campaign Copy',
                  badge: 'Submitted',
                  color: 'blue',
                },
                {
                  actor: 'Procode AI Engine',
                  role: 'Automated Inspector',
                  action: 'Banned Word Detected',
                  time: '2 hours ago',
                  target: 'Term "cheap" replaced with "budget-friendly"',
                  badge: 'Corrected',
                  color: 'purple',
                },
              ].map((act, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                      {act.actor}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {act.action} • <span className="text-cyan-400">{act.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
