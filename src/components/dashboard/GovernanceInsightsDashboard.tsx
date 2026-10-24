import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  BookMarked,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { GovernanceMetrics } from '../../types/governance';

interface GovernanceInsightsDashboardProps {
  metrics: GovernanceMetrics;
  onNavigateToWorkflow: () => void;
}

export const GovernanceInsightsDashboard: React.FC<GovernanceInsightsDashboardProps> = ({
  metrics,
  onNavigateToWorkflow,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Feature #13
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                Governance Insights Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center space-x-2">
              <BarChart3 className="w-7 h-7 text-blue-400" />
              <span>Enterprise Brand Governance Analytics</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              High-level intelligence summarizing recurring errors, frequently violated guidelines,
              prohibited vocabulary spikes, and departmental compliance trends.
            </p>
          </div>

          <button
            onClick={onNavigateToWorkflow}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition self-start md:self-auto"
          >
            <span>Review Content Submissions</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Reviewed Assets</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {metrics.totalContentReviewed}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last month</span>
          </div>
        </div>

        {/* Avg Compliance Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Mean Compliance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {metrics.overallComplianceRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Target benchmark: &gt;90%
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>In Review Queue</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {metrics.pendingReviewsCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Requires manager sign-off
          </div>
        </div>

        {/* Stale / Expired Facts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Expired Facts Radar</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400 font-mono">
            {metrics.expiredFactsCount}
          </div>
          <div className="text-[11px] text-red-400">
            1 Outdated Stat Flagged
          </div>
        </div>
      </div>

      {/* Main Grid: Recurring Violations & Banned Words */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 5 Recurring Brand Violations */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>Frequently Violated Brand Rules</span>
              </h3>
              <p className="text-xs text-slate-400">
                Identifies rules needing clearer employee training or policy refinement
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">All-Time</span>
          </div>

          <div className="space-y-3">
            {metrics.recurringViolations.map((item, idx) => {
              const maxViolations = 50;
              const percent = Math.min(100, (item.violationCount / maxViolations) * 100);

              return (
                <div key={item.ruleCode} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                        {item.ruleCode}
                      </span>
                      <span className="font-medium text-slate-200">{item.ruleTitle}</span>
                    </div>
                    <span className="font-mono font-bold text-red-400">
                      {item.violationCount} hits
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        idx === 0
                          ? 'bg-red-500'
                          : idx === 1
                          ? 'bg-orange-500'
                          : idx === 2
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Frequent Banned Words */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BookMarked className="w-4 h-4 text-indigo-400" />
                <span>Top Prohibited Vocabulary Hits</span>
              </h3>
              <p className="text-xs text-slate-400">
                Banned words caught by automated pre-flight checks
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {metrics.frequentBannedWords.map((word) => (
              <div
                key={word.word}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-red-400 line-through">
                    "{word.word}"
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    → Use <span className="text-emerald-400 font-semibold">{word.replacement}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-200 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                    {word.occurrences}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Compliance & Score Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Ranking */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Departmental Governance Ranking</span>
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {metrics.departmentCompliance.map((dept) => (
              <div
                key={dept.department}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200">{dept.department}</div>
                  <div className="text-[11px] text-slate-400">
                    {dept.reviewed} documents reviewed
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    {dept.avgScore}%
                  </div>
                  <div className="text-[10px] text-slate-400">Average Compliance</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Month Compliance Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>5-Month Organization Compliance Curve</span>
            </h3>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {metrics.scoreTrends.map((point) => {
              const heightPercent = ((point.score - 70) / 30) * 100;
              return (
                <div key={point.month} className="flex flex-col items-center space-y-2 flex-1">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    {point.score}%
                  </span>
                  <div className="w-8 bg-slate-800 rounded-t-lg h-28 flex items-end justify-center p-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono font-semibold">
                    {point.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300">
            Systematic pre-flight checking has boosted organizational brand fidelity by +11.2% over 5 months.
          </div>
        </div>
      </div>
    </div>
  );
};
