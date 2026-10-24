import React, { useState } from 'react';
import {
  BookMarked,
  ArrowRight,
  Plus,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { DictionaryTerm, User } from '../../types/governance';

interface BannedWordDictionaryProps {
  terms: DictionaryTerm[];
  onAddTerm: (term: DictionaryTerm) => void;
  currentUser: User;
  theme?: 'dark' | 'light';
}

export const BannedWordDictionary: React.FC<BannedWordDictionaryProps> = ({
  terms,
  onAddTerm,
  currentUser,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New term state
  const [prohibitedTerm, setProhibitedTerm] = useState('');
  const [preferredAlternative, setPreferredAlternative] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<DictionaryTerm['category']>('Tone Softener');
  const [severity, setSeverity] = useState<DictionaryTerm['severity']>('high');
  const [contextUsage, setContextUsage] = useState('');

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prohibitedTerm || !preferredAlternative) return;

    const newTerm: DictionaryTerm = {
      id: `dict-${Date.now()}`,
      prohibitedTerm: prohibitedTerm.trim(),
      preferredAlternative: preferredAlternative.trim(),
      category,
      reason: reason || 'Non-compliant with standard brand tone.',
      severity,
      contextUsage: contextUsage || `Use "${preferredAlternative}" instead of "${prohibitedTerm}".`,
      tags: ['Custom', category],
    };

    onAddTerm(newTerm);
    setShowAddModal(false);
    setProhibitedTerm('');
    setPreferredAlternative('');
    setReason('');
    setContextUsage('');
  };

  const filteredTerms = terms.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category === selectedCat;
    const matchesSearch =
      t.prohibitedTerm.toLowerCase().includes(search.toLowerCase()) ||
      t.preferredAlternative.toLowerCase().includes(search.toLowerCase()) ||
      t.reason.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div
      className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Feature #3
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
              Approved & Prohibited Vocabulary
            </span>
          </div>
          <h3 className={`text-base font-bold mt-0.5 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <BookMarked className="w-5 h-5 text-indigo-500" />
            <span>Approved & Banned Word Dictionary</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {terms.length} Mappings
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Maps unapproved discount slang, absolute guarantees, and hype buzzwords to preferred corporate expressions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search prohibited words..."
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {[
          'all',
          'Tone Softener',
          'Legal Accuracy',
          'Brand Differentiator',
          'Product Precision',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedCat === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Mappings' : cat}
          </button>
        ))}
      </div>

      {/* Dictionary Grid/Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Top Bar with Category & Severity */}
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-semibold text-slate-400">{term.category}</span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    term.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : term.severity === 'high'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                >
                  {term.severity}
                </span>
              </div>

              {/* Term Mapping Box */}
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase text-red-400">Prohibited</div>
                  <div className="font-mono font-bold text-red-300 text-xs line-through decoration-red-500 decoration-2">
                    "{term.prohibitedTerm}"
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase text-emerald-400">Preferred</div>
                  <div className="font-mono font-bold text-emerald-300 text-xs">
                    "{term.preferredAlternative}"
                  </div>
                </div>
              </div>

              {/* Reason */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                <span className="text-slate-400 font-medium">Why: </span>
                {term.reason}
              </p>
            </div>

            {/* Context Example */}
            {term.contextUsage && (
              <div className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 font-serif italic">
                "{term.contextUsage}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Term Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Add Prohibited Vocabulary Rule</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTerm} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Prohibited Term / Phrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. cheap, zero risk, crazy fast"
                  value={prohibitedTerm}
                  onChange={(e) => setProhibitedTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Preferred Compliant Alternative
                </label>
                <input
                  type="text"
                  placeholder="e.g. cost-effective, high resilience, optimized velocity"
                  value={preferredAlternative}
                  onChange={(e) => setPreferredAlternative(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as DictionaryTerm['category'])
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Tone Softener">Tone Softener</option>
                    <option value="Legal Accuracy">Legal Accuracy</option>
                    <option value="Brand Differentiator">Brand Differentiator</option>
                    <option value="Product Precision">Product Precision</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) =>
                      setSeverity(e.target.value as DictionaryTerm['severity'])
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="critical">Critical (Blocks Publication)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Reason for Prohibition
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this word damages brand perception or incurs legal risk..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Contextual Example Usage (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instead of 'cheap starter tier', use 'budget-friendly starter tier'."
                  value={contextUsage}
                  onChange={(e) => setContextUsage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
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
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
