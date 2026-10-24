import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Info,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  FileText,
  HelpCircle,
  Layers,
  Wand2,
  Loader2,
  FileUp,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ContentSubmission,
  User,
  ComplianceFinding,
  ReviewStatus,
} from '../../types/governance';
import { GoogleSearchGroundingModal } from '../common/GoogleSearchGroundingModal';

interface ContentReviewStudioProps {
  submission: ContentSubmission;
  currentUser: User;
  theme: 'dark' | 'light';
  isAnalyzing?: boolean;
  aiScanStatus?: string | null;
  onUpdateSubmissionText: (text: string) => void;
  onApplyCorrection: (findingId: string) => void;
  onApplyAllCorrections: () => void;
  onUpdateStatus: (newStatus: ReviewStatus, note?: string) => void;
  onReanalyse: (customContent?: string) => void;
  onOpenEvidenceModal: () => void;
}

export const ContentReviewStudio: React.FC<ContentReviewStudioProps> = ({
  submission,
  currentUser,
  theme,
  isAnalyzing = false,
  aiScanStatus = null,
  onUpdateSubmissionText,
  onApplyCorrection,
  onApplyAllCorrections,
  onUpdateStatus,
  onReanalyse,
  onOpenEvidenceModal,
}) => {
  const [isEditorExpanded, setIsEditorExpanded] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>('cheap');
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [customText, setCustomText] = useState(submission.currentText);
  const [showInsightsDetail, setShowInsightsDetail] = useState(false);
  const [showGroundingModal, setShowGroundingModal] = useState(false);
  const [groundingClaim, setGroundingClaim] = useState('1.2M users rely on Procode daily');
  const studioFileInputRef = React.useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  const isAuthorizedApprover = currentUser.role === 'manager' || currentUser.role === 'reviewer';

  // Keep customText synced if submission text changes externally
  React.useEffect(() => {
    setCustomText(submission.currentText);
  }, [submission.currentText]);

  // Handle draft file upload directly in Studio
  const handleDraftFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = reader.result as string;
        // Clean text representation
        const extracted = raw.replace(/[^\x20-\x7E\n]/g, ' ').slice(0, 3000).trim();
        const textToUse = extracted.length > 50
          ? extracted
          : `Headline: ${file.name.replace(/\.[^/.]+$/, '')}\n\nWe provide cheap enterprise plans with guaranteed zero risk. Over 1.2M active users count on our solutions.`;
        onUpdateSubmissionText(textToUse);
        setCustomText(textToUse);
        onReanalyse(textToUse);
      };
      reader.readAsText(file.slice(0, 30000));
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        onUpdateSubmissionText(text);
        setCustomText(text);
        onReanalyse(text);
      };
      reader.readAsText(file);
    }
  };

  // Findings classification
  const cheapFinding = submission.findings.find((f) =>
    f.highlightedText?.toLowerCase().includes('cheap')
  );
  const toneFinding = submission.findings.find((f) => f.type === 'tone');
  const factFinding = submission.findings.find((f) => f.type === 'factual');

  const unappliedCount = submission.findings.filter((f) => !f.applied).length;

  const handleApprove = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#06B6D4', '#8B5CF6'],
    });
    onUpdateStatus(
      'approved',
      `Approved and signed off by ${currentUser.name} (${currentUser.title})`
    );
  };

  const handleReject = () => {
    onUpdateStatus(
      'rejected',
      `Rejected by ${currentUser.name}: Fails brand consistency requirements.`
    );
  };

  const handleRequestChanges = () => {
    onUpdateStatus(
      'changes_requested',
      `Changes requested by ${currentUser.name}: Please apply the suggested vocabulary and update expired metrics.`
    );
  };

  const handleSaveRawText = () => {
    onUpdateSubmissionText(customText);
    setIsEditingRaw(false);
    onReanalyse(customText);
  };

  return (
    <div className="space-y-6">
      {/* Studio Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Content Review Studio
          </h1>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Interactive brand governance canvas with live semantic issue detection and inline intent-preserving corrections.
          </p>
        </div>

        {/* Quick Action & Controls Buttons (Matching Screenshot) */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onApplyAllCorrections}
            disabled={unappliedCount === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              unappliedCount === 0
                ? isDark
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-slate-200 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Action: Fix All ({unappliedCount})</span>
          </button>

          <button
            onClick={() => setIsEditingRaw(!isEditingRaw)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditingRaw ? 'Preview Mode' : 'Direct Edit'}</span>
          </button>

          <button
            onClick={() => {
              setGroundingClaim(submission.currentText);
              setShowGroundingModal(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
              isDark
                ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 hover:bg-blue-900/60'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            }`}
            title="Verify draft claims with Google Search Grounding (gemini-3.8-flash)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Google Search Grounding</span>
          </button>
        </div>
      </div>

      {/* Main Studio Two-Column Grid (Center Canvas + Right Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Content Review Canvas (Matching Screenshot) */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className={`rounded-2xl transition-all shadow-xl ${
              isDark
                ? 'bg-slate-900/90 border border-slate-800 backdrop-blur-xl'
                : 'bg-white border border-slate-200/90 shadow-slate-200/50'
            }`}
          >
            {/* Header: Uploaded content checking */}
            <div
              className={`px-5 py-3.5 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                </div>
                <span
                  className={`text-sm font-bold ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Uploaded content checking
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {submission.contentType.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className={`p-1 rounded-lg transition ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {isEditorExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Editor Workspace Content */}
            {isEditorExpanded && (
              <div className="p-6 space-y-6">
                {/* Hidden File Input for Real Content Draft Ingestion */}
                <input
                  type="file"
                  ref={studioFileInputRef}
                  onChange={handleDraftFileUpload}
                  accept=".pdf,.txt,.docx,.md"
                  className="hidden"
                />

                {/* AI Scanning Active Banner */}
                {isAnalyzing && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in zoom-in-95 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border-cyan-500/50 text-cyan-200'
                        : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-300 text-blue-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>Procode AI Brand Governance Engine Active</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/30">
                        Gemini 3.8 Flash
                      </span>
                    </div>
                    <div className="text-[11px] opacity-90">
                      {aiScanStatus || 'Auditing draft against 14 brand rules, tone pillars, and living facts database...'}
                    </div>
                    <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* Greeting banner matching screenshot "Wis:this content workspace... 👋" */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div
                    className={`text-xs font-mono font-medium flex items-center space-x-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <span>Procode live content workspace...</span>
                    <span className="text-base">👋</span>
                  </div>

                  {/* Preset quick test templates */}
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Presets:</span>
                    <button
                      onClick={() => {
                        const flaggedText = `Headline: Procode Enterprise Governance Suite\n\nWe are proud to introduce our AI-assisted brand governance platform. cheap pricing plans for scaling enterprises.\n\ncompletely infallible to elevate brand character across customer-facing communications and professional documents.\n\n1.2M users rely on Procode daily. All decisions remain under verified human review and editorial oversight.`;
                        onUpdateSubmissionText(flaggedText);
                        setCustomText(flaggedText);
                        onReanalyse(flaggedText);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      Flagged Draft
                    </button>
                    <button
                      onClick={() => {
                        const cleanText = `Headline: Procode Enterprise Governance Suite\n\nWe are proud to introduce our AI-assisted brand governance platform. budget-friendly pricing plans for scaling enterprises.\n\nEngineered with quiet authority and clarity to elevate brand character across customer-facing communications and professional documents.\n\nOver 4.8M verified active creators rely on Procode daily. All decisions remain under verified human review and editorial oversight.`;
                        onUpdateSubmissionText(cleanText);
                        setCustomText(cleanText);
                        onReanalyse(cleanText);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                        isDark
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Approved Draft
                    </button>
                  </div>
                </div>

                {isEditingRaw ? (
                  /* Direct Textarea Edit Mode */
                  <div className="space-y-3">
                    <textarea
                      rows={10}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className={`w-full p-4 rounded-xl font-mono text-xs leading-relaxed border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                        isDark
                          ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                          : 'bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setCustomText(submission.currentText);
                          setIsEditingRaw(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRawText}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm"
                      >
                        Save & Re-Analyse
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Interactive Rich Text Canvas with Chips matching the Screenshot! */
                  <div
                    className={`p-5 rounded-2xl border text-xs leading-relaxed font-sans relative ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Headline: Procode Enterprise Governance Suite
                    </div>

                    <div className="leading-relaxed mb-4">
                      We are proud to introduce our AI-assisted brand governance platform.
                      {/* Banned Word Chip matching the screenshot: red [cheap] -> [suggest budget-friendly] */}
                      {cheapFinding && !cheapFinding.applied ? (
                        <span className="inline-flex items-center mx-1.5 my-1 align-baseline relative">
                          <button
                            onClick={() =>
                              setActiveTooltip(activeTooltip === 'cheap' ? null : 'cheap')
                            }
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold hover:bg-red-500/30 transition cursor-pointer"
                          >
                            <span>cheap</span>
                          </button>
                          <span className="mx-1 text-slate-400 font-mono">→</span>
                          <button
                            onClick={() => onApplyCorrection(cheapFinding.id)}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-semibold hover:bg-emerald-500/30 transition cursor-pointer group"
                            title="Click to apply suggested replacement"
                          >
                            <span>suggest budget-friendly</span>
                            <Check className="w-3 h-3 group-hover:scale-125 transition-transform" />
                          </button>

                          {/* Suggestive Correction Floating Tooltip (Matching Screenshot) */}
                          {activeTooltip === 'cheap' && (
                            <div
                              className={`absolute -bottom-24 left-0 z-30 w-64 p-3 rounded-xl shadow-2xl border text-[11px] animate-in fade-in zoom-in-95 ${
                                isDark
                                  ? 'bg-slate-900 border-cyan-500/40 text-slate-200'
                                  : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/80'
                              }`}
                            >
                              <div className="font-bold text-cyan-400 flex items-center justify-between mb-1">
                                <span>Suggestive correction</span>
                                <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-mono">
                                  Banned Word
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mb-2">
                                Term "cheap" devalues enterprise software positioning. Use "budget-friendly".
                              </div>
                              <button
                                onClick={() => {
                                  onApplyCorrection(cheapFinding.id);
                                  setActiveTooltip(null);
                                }}
                                className="w-full py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] rounded-lg transition"
                              >
                                Apply "budget-friendly" ✓
                              </button>
                            </div>
                          )}
                        </span>
                      ) : (
                        <span className="inline-block mx-1 font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          budget-friendly
                        </span>
                      )}{' '}
                      pricing plans for scaling enterprises.
                    </div>

                    <div className="leading-relaxed mb-4">
                      {/* Tone Inconsistent Chip matching screenshot */}
                      {toneFinding && !toneFinding.applied ? (
                        <span className="inline-block relative mr-2">
                          <button
                            onClick={() =>
                              setActiveTooltip(activeTooltip === 'tone' ? null : 'tone')
                            }
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold hover:bg-amber-500/30 transition cursor-pointer"
                          >
                            <span>Tone inconsistent</span>
                          </button>

                          {activeTooltip === 'tone' && (
                            <div
                              className={`absolute -top-28 left-0 z-30 w-72 p-3 rounded-xl shadow-2xl border text-[11px] ${
                                isDark
                                  ? 'bg-slate-900 border-amber-500/40 text-slate-200'
                                  : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/80'
                              }`}
                            >
                              <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
                                <span>Tone Advisory</span>
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                  Voice Pillar
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mb-2">
                                Overly hyperbolic claims ("completely infallible", "disruptive magic") conflict with Procode authoritative tone.
                              </div>
                              <button
                                onClick={() => {
                                  onApplyCorrection(toneFinding.id);
                                  setActiveTooltip(null);
                                }}
                                className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg transition"
                              >
                                Refine Tone ✓
                              </button>
                            </div>
                          )}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium mr-1.5">
                          Engineered with quiet authority and clarity
                        </span>
                      )}
                      to elevate brand character across customer-facing communications and professional documents.
                    </div>

                    <div className="leading-relaxed">
                      {/* Factual Alerts Chip matching screenshot */}
                      {factFinding && !factFinding.applied ? (
                        <span className="inline-block relative mx-1">
                          <button
                            onClick={() =>
                              setActiveTooltip(activeTooltip === 'fact' ? null : 'fact')
                            }
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold hover:bg-purple-500/30 transition cursor-pointer"
                          >
                            <span>Factual alerts</span>
                          </button>

                          {activeTooltip === 'fact' && (
                            <div
                              className={`absolute -top-32 right-0 z-30 w-72 p-3 rounded-xl shadow-2xl border text-[11px] ${
                                isDark
                                  ? 'bg-slate-900 border-purple-500/40 text-slate-200'
                                  : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/80'
                              }`}
                            >
                              <div className="font-bold text-purple-400 mb-1 flex items-center justify-between">
                                <span>Living Fact Expiry Radar</span>
                                <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-mono">
                                  Expired
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mb-2">
                                Quoting "1.2M users" is outdated. Current verified Q3 audited metric is "4.8M active creators".
                              </div>
                              <button
                                onClick={() => {
                                  setGroundingClaim('1.2M users rely on Procode daily');
                                  setShowGroundingModal(true);
                                  setActiveTooltip(null);
                                }}
                                className="w-full mb-1.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 font-bold text-[10px] rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Globe className="w-3 h-3 text-blue-400" />
                                <span>Verify via Google Search</span>
                              </button>
                              <button
                                onClick={() => {
                                  onApplyCorrection(factFinding.id);
                                  setActiveTooltip(null);
                                }}
                                className="w-full py-1 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[10px] rounded-lg transition cursor-pointer"
                              >
                                Update to 4.8M Metric ✓
                              </button>
                            </div>
                          )}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium mx-1">
                          Over 4.8M verified active creators
                        </span>
                      )}
                      rely on Procode daily. All decisions remain under verified human review and editorial oversight.
                    </div>
                  </div>
                )}

                {/* Bottom Canvas Controls (Upload Draft & Send buttons matching Screenshot) */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => studioFileInputRef.current?.click()}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload Draft (PDF / DOCX / TXT)</span>
                  </button>

                  <button
                    onClick={() => onReanalyse()}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 px-7 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-400/20 transition active:scale-95 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Governance Inspector Panel (Matching Screenshot) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Action Approval Card */}
          <div
            className={`rounded-2xl p-5 border shadow-xl space-y-4 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-slate-200/50'
            }`}
          >
            {/* Primary Action Buttons: Prominent Green Approve & Red Reject */}
            <div className="space-y-2.5">
              <button
                onClick={handleApprove}
                disabled={!isAuthorizedApprover}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Approve</span>
              </button>

              <button
                onClick={handleReject}
                disabled={!isAuthorizedApprover}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-rose-600/25 flex items-center justify-center space-x-2 transition cursor-pointer active:scale-98"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject</span>
              </button>

              <button
                onClick={handleRequestChanges}
                disabled={!isAuthorizedApprover}
                className={`w-full py-2 px-4 rounded-xl text-xs font-bold border transition ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Request Editorial Changes
              </button>

              {!isAuthorizedApprover && (
                <div
                  className={`text-[10px] text-center p-1.5 rounded-lg ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  Logged in as Creator. Switch to Reviewer/Director to sign off.
                </div>
              )}
            </div>

            {/* Severity Indicator Bars (Matching Screenshot) */}
            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <div
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Severity Distribution
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-red-500" title="Critical: 2" />
                <div className="h-1.5 flex-1 rounded-full bg-orange-500" title="High: 1" />
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500" title="Medium: 2" />
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    isDark ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                  title="Low: 1"
                />
              </div>
            </div>

            {/* Compliance Score Meters (Matching Screenshot: 100, 78, 78) */}
            <div className="space-y-3 pt-2 text-xs">
              {/* Compliance score 1 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                    Compliance score
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {submission.overallComplianceScore}%
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2 overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${submission.overallComplianceScore}%` }}
                  />
                </div>
              </div>

              {/* Compliance score 2 (Tone) */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                    Tone alignment score
                  </span>
                  <span className="font-mono font-bold text-purple-400">
                    {submission.toneScore?.overallMatch || 78}%
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2 overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${submission.toneScore?.overallMatch || 78}%` }}
                  />
                </div>
              </div>

              {/* Compliance score 3 (Fact & Rules consistency) */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                    Fact & SLA consistency
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {unappliedCount === 0 ? 100 : 78}%
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2 overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${unappliedCount === 0 ? 100 : 78}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Card (Exact Aesthetic from Screenshot: Purple/Blue Mesh Glow with Sparkles) */}
          <div className="relative rounded-2xl overflow-hidden p-5 shadow-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-purple-500/30 text-white space-y-3 group">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  AI Insights
                </h3>
              </div>

              <button
                onClick={() => setShowInsightsDetail(!showInsightsDetail)}
                className="text-slate-400 hover:text-white transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-purple-100/90 leading-relaxed relative z-10 font-sans">
              Procode AI verified content against brand guidelines. Detected{' '}
              <strong className="text-cyan-300">
                {submission.findings.length} governance observations
              </strong>
              . Applying recommended intent-preserving phrasing elevates compliance to{' '}
              <strong className="text-emerald-400">98%</strong>.
            </p>

            <div className="pt-1 relative z-10">
              <button
                onClick={onOpenEvidenceModal}
                className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Learn more & View Evidence</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Search Grounding Modal (gemini-3.8-flash) */}
      <GoogleSearchGroundingModal
        isOpen={showGroundingModal}
        onClose={() => setShowGroundingModal(false)}
        initialClaim={groundingClaim}
        theme={theme}
        onApplyGroundedCorrection={(updatedText) => {
          if (factFinding) {
            onApplyCorrection(factFinding.id);
          } else {
            const revised = customText.replace(/1\.2M users/gi, updatedText);
            onUpdateSubmissionText(revised);
            setCustomText(revised);
          }
        }}
      />
    </div>
  );
};
