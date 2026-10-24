import React, { useState } from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BrandRule, User } from '../../types/governance';

interface ConflictingRulesResolverProps {
  rules: BrandRule[];
  onResolveConflict: (ruleId1: string, ruleId2: string, resolutionChoice: string) => void;
  currentUser: User;
  theme?: 'dark' | 'light';
}

export const ConflictingRulesResolver: React.FC<ConflictingRulesResolverProps> = ({
  rules,
  onResolveConflict,
  currentUser,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedResolution, setSelectedResolution] = useState<string>('compromise');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolved, setIsResolved] = useState(false);

  // Find rules that have conflict flag
  const conflictingRules = rules.filter((r) => r.hasConflict);
  const rule1 = conflictingRules.find((r) => r.code === 'RULE-HEAD-06');
  const rule2 = conflictingRules.find((r) => r.code === 'RULE-TRADE-07');

  if (!rule1 || !rule2) return null;

  const isAlreadyResolved = rule1.resolved && rule2.resolved;

  const handleResolve = () => {
    let choiceText = '';
    if (selectedResolution === 'short_headline') {
      choiceText = 'Precedence: PR Style Manual takes priority. Allow short headline <8 words; place full trademark in subtitle.';
    } else if (selectedResolution === 'full_trademark') {
      choiceText = 'Precedence: Legal IP Policy takes priority. Full trademark mandatory in main title.';
    } else {
      choiceText = 'Standard Compromise: Headline must be under 8 words, followed by mandatory Subtitle kicker with full legal trademark "Procode™ AI-Powered Enterprise Brand Governance Suite".';
    }

    onResolveConflict(rule1.id, rule2.id, `${choiceText} Authorized by: ${currentUser.name} (${currentUser.role}). Note: ${resolutionNote || 'Standard policy harmonization'}`);
    setIsResolved(true);
  };

  return (
    <div
      className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
        isDark
          ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border-amber-500/40 text-slate-100'
          : 'bg-white border-amber-300 text-slate-900 shadow-sm'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Feature #10
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                Conflicting Rules Resolver
              </span>
            </div>
            <h3 className={`text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Contradictory Brand Guidelines Detected
            </h3>
            <p className="text-xs text-slate-400">
              Two active brand guidelines create an impossible constraint for content creators.
              Requires authorized reviewer resolution.
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border self-start ${
            isAlreadyResolved || isResolved
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
          }`}
        >
          {isAlreadyResolved || isResolved ? 'Harmonized & Resolved' : 'Needs Reviewer Clarification'}
        </span>
      </div>

      {/* Side-by-side Contradiction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1 */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {rule1.code}
            </span>
            <span className="text-slate-400">{rule1.category}</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">{rule1.title}</div>
          <div className="text-xs text-slate-300 italic font-serif bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            "{rule1.ruleExcerpt}"
          </div>
          <div className="text-[11px] text-slate-400">
            Source: <span className="text-slate-300">{rule1.sourceDoc}</span>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {rule2.code}
            </span>
            <span className="text-slate-400">{rule2.category}</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">{rule2.title}</div>
          <div className="text-xs text-slate-300 italic font-serif bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            "{rule2.ruleExcerpt}"
          </div>
          <div className="text-[11px] text-slate-400">
            Source: <span className="text-slate-300">{rule2.sourceDoc}</span>
          </div>
        </div>
      </div>

      {/* Conflict Explanation */}
      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 flex items-start space-x-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">The Conflict: </span>
          The legal trademark name is 7 words long ("Procode™ AI-Powered Enterprise Brand Governance Suite").
          If a creator includes the trademark, they only have 1 word left before violating the PR headline length limit!
        </div>
      </div>

      {/* Resolution Selector for Reviewers / Managers */}
      {!isAlreadyResolved && !isResolved ? (
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs space-y-3">
          <div className="font-semibold text-slate-200 flex items-center justify-between">
            <span>Harmonize Guideline Precedence:</span>
            <span className="text-[11px] text-blue-400 font-normal">
              Reviewer: {currentUser.name} ({currentUser.role})
            </span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer border border-slate-800">
              <input
                type="radio"
                name="conflict_resolution"
                value="compromise"
                checked={selectedResolution === 'compromise'}
                onChange={() => setSelectedResolution('compromise')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-200">
                <strong className="text-blue-300">(Recommended Solution)</strong> Short Headline in Title + Full Trademark in Subtitle kicker.
              </span>
            </label>

            <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer border border-slate-800">
              <input
                type="radio"
                name="conflict_resolution"
                value="short_headline"
                checked={selectedResolution === 'short_headline'}
                onChange={() => setSelectedResolution('short_headline')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-200">
                Strict PR priority: Exempt press release titles from trademark length rule.
              </span>
            </label>

            <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer border border-slate-800">
              <input
                type="radio"
                name="conflict_resolution"
                value="full_trademark"
                checked={selectedResolution === 'full_trademark'}
                onChange={() => setSelectedResolution('full_trademark')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-200">
                Strict Legal priority: Increase headline limit to 14 words whenever trademark is used.
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              placeholder="Optional reviewer directive note..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleResolve}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center space-x-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve & Harmonize</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Harmonization Active: Clarification Logged in Brand Knowledge Base</span>
          </div>
          <p className="text-slate-300">
            {rule1.conflictResolution ||
              'Standard Compromise: Headlines must remain under 8 words. Full trademark is placed in the mandatory subtitle.'}
          </p>
        </div>
      )}
    </div>
  );
};
