import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  X,
  RefreshCw,
} from 'lucide-react';
import { GroundingVerificationResult } from '../../types/governance';
import { verifyClaimWithGoogleSearchGrounding } from '../../services/groundingService';

interface GoogleSearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClaim?: string;
  theme?: 'dark' | 'light';
  onApplyGroundedCorrection?: (updatedText: string) => void;
}

export const GoogleSearchGroundingModal: React.FC<GoogleSearchGroundingModalProps> = ({
  isOpen,
  onClose,
  initialClaim = '1.2M users rely on Procode daily',
  theme = 'dark',
  onApplyGroundedCorrection,
}) => {
  const isDark = theme === 'dark';
  const [claimInput, setClaimInput] = useState(initialClaim);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundingVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-run if opened with claim
  React.useEffect(() => {
    if (isOpen && initialClaim) {
      setClaimInput(initialClaim);
      handleVerify(initialClaim);
    }
  }, [isOpen, initialClaim]);

  const handleVerify = async (claimToVerify: string) => {
    if (!claimToVerify.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await verifyClaimWithGoogleSearchGrounding(claimToVerify);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to verify claim with Google Search Grounding');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: GroundingVerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED BY GOOGLE SEARCH</span>
          </span>
        );
      case 'outdated':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>OUTDATED METRIC / EXPIRED</span>
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>CONTRADICTED BY WEB SOURCES</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>UNVERIFIABLE</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark
              ? 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-slate-800'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-sm">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">Google Search Grounding Engine</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  gemini-3.8-flash (with googleSearch)
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cross-references corporate claims & numbers against live verified web data.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Claim Input / Search Bar */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Claim, Metric, or Assertion to Verify:
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify(claimInput)}
                  placeholder="e.g. 1.2M users rely on Procode daily..."
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isDark
                      ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </div>

              <button
                onClick={() => handleVerify(claimInput)}
                disabled={loading || !claimInput.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching Web...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Verify Claim</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick claim chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try:</span>
              {[
                '1.2M users rely on Procode daily',
                'Enterprise 99.95% cloud availability SLA',
                'SOC 2 Type II compliance certified',
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => {
                    setClaimInput(sample);
                    handleVerify(sample);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-500 hover:text-white'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div
              className={`p-6 rounded-2xl border text-center space-y-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center animate-spin">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-400">Google Search Grounding Active</h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Querying authoritative indexes and Google Knowledge Graph via gemini-3.8-flash...
                </p>
              </div>
              <div className="w-48 bg-slate-700/40 rounded-full h-1.5 mx-auto overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Grounding Result Card */}
          {result && !loading && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800 shadow-xl'
                    : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                {/* Result Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(result.status)}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(result.verifiedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">
                    Model: {result.sourceModel}
                  </span>
                </div>

                {/* Quota Notice Banner if free-tier quota is reached */}
                {result.quotaExceeded && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-amber-200">Free-Tier Quota Limit</span>
                      <p className="text-[11px] text-amber-300/90 leading-relaxed">
                        {result.notice || 'Quota reached on free tier. Using verified enterprise knowledge graph. To increase quota, upgrade your plan in Settings > Secrets.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary / Assessment */}
                <div className="space-y-1.5">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Google Search Assessment:
                  </h4>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    {result.summary}
                  </p>
                  {result.details && result.details !== result.summary && (
                    <p className={`text-[11px] leading-relaxed pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {result.details}
                    </p>
                  )}
                </div>

                {/* Recommended Phrasing (if provided) */}
                {result.recommendedPhrasing && (
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Search-Grounded Recommended Phrasing:
                      </span>
                      <p className="text-xs font-semibold">
                        "{result.recommendedPhrasing}"
                      </p>
                    </div>

                    {onApplyGroundedCorrection && (
                      <button
                        onClick={() => {
                          onApplyGroundedCorrection(result.recommendedPhrasing!);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Apply to Draft</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Search Queries Executed */}
                {result.searchQueries && result.searchQueries.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Google Web Queries Executed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.searchQueries.map((query, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                            isDark
                              ? 'bg-slate-800/80 border-slate-700 text-cyan-300'
                              : 'bg-white border-slate-200 text-cyan-700'
                          }`}
                        >
                          <Search className="w-2.5 h-2.5" />
                          <span>{query}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Web Citations / Grounding Chunks */}
                {result.sources && result.sources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/40">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Verified Web Sources & Citations:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {result.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between transition group ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-blue-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span className="font-medium truncate">{src.title}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-[10px] text-slate-400 group-hover:text-blue-400 flex-shrink-0 ml-2">
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Grounding active via Google GenAI SDK & Gemini 3.8 Flash</span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-medium transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
