import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  BookOpen,
  Wand2,
  Check,
  Eye,
  Layers,
  SplitSquareVertical,
  AlignLeft,
  Image as ImageIcon,
} from 'lucide-react';
import {
  ContentSubmission,
  ComplianceFinding,
  User,
  SeverityLevel,
} from '../../types/governance';
import { BrandToneIdentifier } from './BrandToneIdentifier';
import { CrossLanguageGuardian } from './CrossLanguageGuardian';
import { VisualComplianceModal } from '../visual/VisualComplianceModal';

interface ExplainableQualityReportProps {
  submission: ContentSubmission;
  onApplyCorrection: (findingId: string) => void;
  onApplyAllCorrections: () => void;
  onProceedToReview: () => void;
  currentUser: User;
}

export const ExplainableQualityReport: React.FC<ExplainableQualityReportProps> = ({
  submission,
  onApplyCorrection,
  onApplyAllCorrections,
  onProceedToReview,
  currentUser,
}) => {
  const [diffViewMode, setDiffViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showVisualModal, setShowVisualModal] = useState<boolean>(false);

  const activeFindings = submission.findings.filter((f) => !f.applied);
  const appliedCount = submission.findings.filter((f) => f.applied).length;

  const criticalCount = activeFindings.filter((f) => f.severity === 'critical').length;
  const highCount = activeFindings.filter((f) => f.severity === 'high').length;
  const mediumCount = activeFindings.filter((f) => f.severity === 'medium').length;

  const filteredFindings = submission.findings.filter((f) => {
    if (selectedSeverity === 'all') return true;
    if (selectedSeverity === 'unapplied') return !f.applied;
    return f.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Quality & Evidence Scorecard
              </span>
              <span className="text-xs text-slate-400">
                Deterministic Rule Grounding & AI Reasoning
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Explainable Compliance Scorecard & Evidence Report
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Deterministic rules and Gemini 3.8 Flash have linked each finding to specific brand
              rules and evidence. Ambiguous cases are flagged for human editorial verification.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => setShowVisualModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Inspect Visuals & Logo</span>
            </button>

            <button
              onClick={onProceedToReview}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition group"
            >
              <span>Submit for Human Review (Step 6)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE #8: CONFIDENCE AND EVIDENCE SCORECARD METRIC ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Compliance Score
          </div>
          <div
            className={`text-3xl font-black font-mono mt-1 ${
              submission.overallComplianceScore >= 90
                ? 'text-emerald-400'
                : submission.overallComplianceScore >= 75
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {submission.overallComplianceScore}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Target: ≥90% for auto-clearance
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Confidence Indicator
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
            96.4%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Rule-backed certainty
          </div>
        </div>

        {/* Critical & High Blockers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Publication Blockers
          </div>
          <div className="text-3xl font-black text-red-400 font-mono mt-1">
            {criticalCount + highCount}
          </div>
          <div className="text-[10px] text-red-300/80 mt-0.5">
            {criticalCount} Critical • {highCount} High
          </div>
        </div>

        {/* Resolved / Fixed Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Corrections Applied
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {appliedCount} / {submission.findings.length}
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">
            {appliedCount > 0 ? 'Score improved significantly' : 'Pending author action'}
          </div>
        </div>
      </div>

      {/* FEATURE #9: CORRECTION SUGGESTIONS - SIDE-BY-SIDE OR INLINE DIFF VIEWER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Feature #9
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Correction Suggestions
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <span>Smart Revision Studio & Intent-Preserving Corrections</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-700 text-xs">
              <button
                onClick={() => setDiffViewMode('side-by-side')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition ${
                  diffViewMode === 'side-by-side'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                onClick={() => setDiffViewMode('inline')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition ${
                  diffViewMode === 'inline'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Inline View</span>
              </button>
            </div>

            {/* 1-Click Apply All */}
            {activeFindings.length > 0 && (
              <button
                onClick={onApplyAllCorrections}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply All {activeFindings.length} Corrections</span>
              </button>
            )}
          </div>
        </div>

        {/* Diff View Box */}
        {diffViewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Draft with Strikethroughs */}
            <div className="bg-slate-950/70 rounded-xl p-4 border border-red-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-red-400 uppercase tracking-wider text-[10px]">
                  Original Submitted Draft
                </span>
                <span className="text-slate-400 text-[10px]">Contains Violations</span>
              </div>
              <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {submission.originalText}
              </div>
            </div>

            {/* Corrected Living Draft */}
            <div className="bg-slate-950/70 rounded-xl p-4 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                  Governed Living Version ({submission.activeVersion})
                </span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">
                  Score: {submission.overallComplianceScore}%
                </span>
              </div>
              <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {submission.currentText}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-200">
            {submission.currentText}
          </div>
        )}
      </div>

      {/* FEATURE #4 & #5: Brand Tone Identifier & Cross Language Guardian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandToneIdentifier toneScore={submission.toneScore} />
        <CrossLanguageGuardian analysis={submission.multilingualAnalysis} />
      </div>

      {/* FEATURE #8: EXPLAINABLE QUALITY REPORT - DETECTED ISSUES & EVIDENCE CARDS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
              <span>Detailed Findings & Evidence Citations</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {submission.findings.length} Items Flagged
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Each finding cites the exact brand rule code, source manual excerpt, confidence score, and suggested replacement
            </p>
          </div>

          {/* Severity Filters */}
          <div className="flex flex-wrap gap-1 text-xs">
            {['all', 'unapplied', 'critical', 'high', 'medium'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedSeverity(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition ${
                  selectedSeverity === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`p-4 rounded-xl border transition ${
                finding.applied
                  ? 'bg-slate-850/40 border-emerald-500/30 opacity-75'
                  : finding.severity === 'critical'
                  ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                  : finding.severity === 'high'
                  ? 'bg-orange-950/20 border-orange-500/40 hover:border-orange-400'
                  : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        finding.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : finding.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      {finding.severity}
                    </span>

                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {finding.supportingEvidence.ruleCode}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {finding.supportingEvidence.ruleTitle}
                    </span>

                    {finding.isUncertain && (
                      <span className="flex items-center space-x-1 text-[10px] font-semibold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <HelpCircle className="w-3 h-3" />
                        <span>Uncertain - Requires Human Verification</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-1">
                    {finding.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {finding.description}
                  </p>
                </div>

                {/* Confidence Badge */}
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-slate-400">Confidence</div>
                  <div className="font-mono font-bold text-cyan-400 text-xs">
                    {(finding.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Snippet & Suggested Replacement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                {/* Flagged passage */}
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-red-500/20 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-red-400">
                    Detected Inconsistent Phrase
                  </div>
                  <div className="font-mono text-red-300 line-through">
                    "{finding.highlightedText || 'Highlighted violation'}"
                  </div>
                </div>

                {/* Suggested Fix */}
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-emerald-400">
                    Compliant Suggested Revision (Preserving Intent)
                  </div>
                  <div className="font-mono text-emerald-300 font-semibold">
                    "{finding.suggestedCorrection}"
                  </div>
                </div>
              </div>

              {/* Supporting Rule Evidence Citation */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-medium">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3 text-blue-400" />
                    <span>Evidence Citation: {finding.supportingEvidence.guidelineSection}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Deterministic Source Grounding</span>
                </div>
                <div className="font-serif italic text-slate-300">
                  "{finding.supportingEvidence.sourceExcerpt}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 pt-2 text-xs">
                <div className="text-[11px] text-slate-400">
                  {finding.explanation}
                </div>

                <div>
                  {finding.applied ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>Correction Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onApplyCorrection(finding.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Apply Correction</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredFindings.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No findings match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Visual Inspector Modal */}
      <VisualComplianceModal
        isOpen={showVisualModal}
        onClose={() => setShowVisualModal(false)}
        imageUrl={submission.attachedImageUrl}
        visualChecks={submission.visualChecks}
      />
    </div>
  );
};
