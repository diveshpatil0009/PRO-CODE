import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  ExternalLink,
  Plus,
  Search,
  Archive,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Radar,
  Globe,
} from 'lucide-react';
import { LivingFact, User } from '../../types/governance';
import { GoogleSearchGroundingModal } from '../common/GoogleSearchGroundingModal';

interface LivingFactSheetProps {
  facts: LivingFact[];
  onUpdateFact: (fact: LivingFact) => void;
  onAddFact: (fact: LivingFact) => void;
  currentUser: User;
  theme?: 'dark' | 'light';
}

export const LivingFactSheet: React.FC<LivingFactSheetProps> = ({
  facts,
  onUpdateFact,
  onAddFact,
  currentUser,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroundingModal, setShowGroundingModal] = useState(false);
  const [groundingClaim, setGroundingClaim] = useState('');
  const [selectedFactForGrounding, setSelectedFactForGrounding] = useState<LivingFact | null>(null);

  // New fact form state
  const [topic, setTopic] = useState('');
  const [approvedStatement, setApprovedStatement] = useState('');
  const [approvedStatistic, setApprovedStatistic] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  const [category, setCategory] = useState<LivingFact['category']>('Metrics & Users');
  const [expiryDays, setExpiryDays] = useState(90);

  // Expiry Radar stats
  const expiredCount = facts.filter((f) => f.isExpired || f.status === 'expired').length;
  const expiringSoonCount = facts.filter((f) => f.isExpiringSoon || f.status === 'expiring').length;
  const activeCount = facts.filter((f) => f.status === 'active').length;

  const handleCreateFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !approvedStatement) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + expiryDays);

    const newFact: LivingFact = {
      id: `fact-${Date.now()}`,
      factCode: `FACT-${Date.now().toString().slice(-4)}`,
      topic,
      approvedStatement,
      approvedStatistic: approvedStatistic || undefined,
      sourceReference: sourceReference || 'Verified Internal Record',
      verifiedBy: currentUser.name,
      lastReviewedDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      isExpired: false,
      isExpiringSoon: false,
      status: 'active',
      category,
    };

    onAddFact(newFact);
    setShowAddModal(false);
    setTopic('');
    setApprovedStatement('');
    setApprovedStatistic('');
    setSourceReference('');
  };

  const handleReverifyFact = (fact: LivingFact) => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setDate(today.getDate() + 180);

    const updated: LivingFact = {
      ...fact,
      lastReviewedDate: today.toISOString().split('T')[0],
      expiryDate: nextYear.toISOString().split('T')[0],
      isExpired: false,
      isExpiringSoon: false,
      status: 'active',
      verifiedBy: `${currentUser.name} (${currentUser.role})`,
    };

    onUpdateFact(updated);
  };

  const handleArchiveFact = (fact: LivingFact) => {
    onUpdateFact({
      ...fact,
      status: 'archived',
    });
  };

  const filteredFacts = facts.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch =
      f.topic.toLowerCase().includes(search.toLowerCase()) ||
      f.approvedStatement.toLowerCase().includes(search.toLowerCase()) ||
      (f.approvedStatistic && f.approvedStatistic.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* FEATURE #6: CONTENT EXPIRY RADAR (Alert Banner) */}
      <div
        className={`rounded-2xl p-5 border shadow-sm ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 text-slate-100'
            : 'bg-gradient-to-r from-amber-50 via-white to-orange-50 border-amber-300 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Feature #6: Content Expiry Radar
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/30 font-semibold">
                  Real-Time Freshness Monitor
                </span>
              </div>
              <h2 className={`text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {expiredCount > 0
                  ? `Warning: ${expiredCount} Expired Fact${expiredCount > 1 ? 's' : ''} Flagged in Database`
                  : 'All Living Facts Verified & Active'}
              </h2>
              <p className={`text-xs mt-0.5 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Procode monitors fact shelf-life. Expired facts like legacy user numbers
                automatically trigger publication blockers during content review.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <div className="text-sm font-bold text-red-500 font-mono">{expiredCount}</div>
              <div className="text-[10px] text-red-600 dark:text-red-300 font-semibold">Expired</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 font-mono">{expiringSoonCount}</div>
              <div className="text-[10px] text-yellow-700 dark:text-yellow-300 font-semibold">Expiring Soon</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{activeCount}</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Active & Fresh</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE #2: LIVING FACT SHEET TABLE */}
      <div
        className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        {/* Controls */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div>
            <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span>Living Fact Sheet Database</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {facts.length} Statements
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              The single source of truth for public statistics, audited metrics, and pricing claims
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search facts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`border rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-500'
                }`}
              />
            </div>

            <button
              onClick={() => {
                setGroundingClaim('1.2M users rely on Procode daily');
                setSelectedFactForGrounding(null);
                setShowGroundingModal(true);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isDark
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 hover:bg-blue-900/60'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
              title="Verify any public metric or claim using live Google Search Grounding with gemini-3.8-flash"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Google Search Grounding</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Fact</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            'all',
            'Metrics & Users',
            'Financial & Pricing',
            'Security & SLA',
            'Certifications',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Facts' : cat}
            </button>
          ))}
        </div>

        {/* Fact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Status & Code</th>
                <th className="py-2.5 px-3">Topic & Approved Statement</th>
                <th className="py-2.5 px-3">Official Stat</th>
                <th className="py-2.5 px-3">Audit Reference</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFacts.map((fact) => (
                <tr
                  key={fact.id}
                  className={`hover:bg-slate-800/40 transition ${
                    fact.status === 'expired'
                      ? 'bg-red-950/10'
                      : fact.status === 'expiring'
                      ? 'bg-yellow-950/10'
                      : ''
                  }`}
                >
                  {/* Status & Code */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-mono text-slate-400 font-semibold">
                      {fact.factCode}
                    </div>
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded mt-1 ${
                        fact.status === 'expired'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : fact.status === 'expiring'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : fact.status === 'archived'
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {fact.status === 'expired' ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>EXPIRED</span>
                        </>
                      ) : fact.status === 'expiring' ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>EXPIRING SOON</span>
                        </>
                      ) : fact.status === 'archived' ? (
                        <span>ARCHIVED</span>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Topic & Statement */}
                  <td className="py-3 px-3 max-w-sm">
                    <div className="font-semibold text-slate-200">{fact.topic}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      {fact.approvedStatement}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Verified by <span className="text-slate-300">{fact.verifiedBy}</span>
                    </div>
                  </td>

                  {/* Statistic Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {fact.approvedStatistic ? (
                      <span className="font-mono font-bold text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-700">
                        {fact.approvedStatistic}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Narrative claim</span>
                    )}
                  </td>

                  {/* Reference */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-slate-300 text-[11px] font-medium">
                      {fact.sourceReference}
                    </div>
                    {fact.sourceUrl && (
                      <a
                        href={fact.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1 mt-0.5"
                      >
                        <span>Source Proof</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                    <div
                      className={
                        fact.status === 'expired'
                          ? 'text-red-400 font-bold'
                          : fact.status === 'expiring'
                          ? 'text-yellow-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {fact.expiryDate}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Reviewed: {fact.lastReviewedDate}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => {
                        setGroundingClaim(`${fact.topic}: ${fact.approvedStatement} ${fact.approvedStatistic || ''}`);
                        setSelectedFactForGrounding(fact);
                        setShowGroundingModal(true);
                      }}
                      title="Verify this fact using live Google Search Grounding (gemini-3.8-flash)"
                      className="px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white transition text-[11px] inline-flex items-center space-x-1 border border-blue-500/30 cursor-pointer"
                    >
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Search Ground</span>
                    </button>
                    <button
                      onClick={() => handleReverifyFact(fact)}
                      title="Re-verify and extend fact validity by 180 days"
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white transition text-[11px] inline-flex items-center space-x-1 border border-slate-700 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Verify</span>
                    </button>
                    {fact.status !== 'archived' && (
                      <button
                        onClick={() => handleArchiveFact(fact)}
                        title="Archive deprecated fact"
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-300 transition text-[11px] inline-flex items-center space-x-1 border border-slate-700 cursor-pointer"
                      >
                        <Archive className="w-3 h-3" />
                        <span>Archive</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Add Living Fact to Knowledge Base</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFact} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LivingFact['category'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Metrics & Users">Metrics & Users</option>
                  <option value="Financial & Pricing">Financial & Pricing</option>
                  <option value="Security & SLA">Security & SLA</option>
                  <option value="Certifications">Certifications</option>
                  <option value="Company Milestones">Company Milestones</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Topic / Metric Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Total Verified Enterprise Customers"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Approved Statistic / Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,450+ Enterprise Brands"
                  value={approvedStatistic}
                  onChange={(e) => setApprovedStatistic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Approved Narrative Statement
                </label>
                <textarea
                  rows={2}
                  placeholder="Exact compliant sentence approved for marketing & press releases..."
                  value={approvedStatement}
                  onChange={(e) => setApprovedStatement(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Source Reference / Audit Evidence
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 2026 Audit Report by KPMG"
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Validity Period
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value={30}>30 Days (Fast-changing)</option>
                  <option value={90}>90 Days (Quarterly Metric)</option>
                  <option value={180}>180 Days (Semi-Annual)</option>
                  <option value={365}>365 Days (Annual Audit)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Living Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Search Grounding Verification Modal (gemini-3.8-flash) */}
      <GoogleSearchGroundingModal
        isOpen={showGroundingModal}
        onClose={() => {
          setShowGroundingModal(false);
          setSelectedFactForGrounding(null);
        }}
        initialClaim={groundingClaim}
        theme={theme}
        onApplyGroundedCorrection={(updatedPhrase) => {
          if (selectedFactForGrounding) {
            const today = new Date();
            const nextYear = new Date();
            nextYear.setDate(today.getDate() + 180);

            const updated: LivingFact = {
              ...selectedFactForGrounding,
              approvedStatement: updatedPhrase,
              approvedStatistic: updatedPhrase.match(/\d+(?:\.\d+)?[MBK%]?/)?.[0] || selectedFactForGrounding.approvedStatistic,
              sourceReference: 'Verified via Live Google Search Grounding',
              sourceUrl: 'https://newsroom.procode.ai/reports/q3-2026-audit',
              lastReviewedDate: today.toISOString().split('T')[0],
              expiryDate: nextYear.toISOString().split('T')[0],
              isExpired: false,
              isExpiringSoon: false,
              status: 'active',
              verifiedBy: `${currentUser.name} (Google Search Grounding)`,
            };
            onUpdateFact(updated);
          }
        }}
      />
    </div>
  );
};
