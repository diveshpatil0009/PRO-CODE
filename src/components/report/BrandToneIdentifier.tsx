import React from 'react';
import { Sparkles, Gauge, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ToneScore } from '../../types/governance';

interface BrandToneIdentifierProps {
  toneScore?: ToneScore;
}

export const BrandToneIdentifier: React.FC<BrandToneIdentifierProps> = ({ toneScore }) => {
  if (!toneScore) return null;

  const isMatched = toneScore.status === 'matched';
  const isMinor = toneScore.status === 'minor_deviation';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Feature #4
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              Brand Tone Identifier
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Tone & Voice Alignment Engine</span>
          </h3>
        </div>

        {/* Status Pill */}
        <div
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isMatched
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : isMinor
              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          {isMatched ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>
            {isMatched
              ? 'Tone Compliant'
              : isMinor
              ? 'Minor Tone Drift'
              : 'Significant Tone Inconsistency'}
          </span>
        </div>
      </div>

      {/* Main Score & Voice Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Dial / Circular Meter representation */}
        <div className="md:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-center space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Overall Tone Match
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-mono">
            {toneScore.overallMatch}%
          </div>
          <div className="text-[11px] text-slate-300">
            Intended: <span className="text-blue-300 font-medium">{toneScore.intendedTone}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Detected: <span className="text-amber-400 font-medium">{toneScore.detectedTone}</span>
          </div>
        </div>

        {/* 5-Attribute Tone Breakdown Bars */}
        <div className="md:col-span-8 space-y-2 text-xs">
          {/* Formality */}
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-300 font-medium">Formality (Enterprise Dignity)</span>
              <span className="font-mono text-slate-400">{toneScore.breakdown.formality}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  toneScore.breakdown.formality >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${toneScore.breakdown.formality}%` }}
              />
            </div>
          </div>

          {/* Clarity */}
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-300 font-medium">Clarity (Jargon-free Plain Speak)</span>
              <span className="font-mono text-slate-400">{toneScore.breakdown.clarity}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  toneScore.breakdown.clarity >= 75 ? 'bg-indigo-500' : 'bg-amber-500'
                }`}
                style={{ width: `${toneScore.breakdown.clarity}%` }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-300 font-medium">Confidence (Quiet Authority)</span>
              <span className="font-mono text-slate-400">{toneScore.breakdown.confidence}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${toneScore.breakdown.confidence}%` }}
              />
            </div>
          </div>

          {/* Empathy */}
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-300 font-medium">Empathy (Respectful of Customer Realities)</span>
              <span className="font-mono text-slate-400">{toneScore.breakdown.empathy}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  toneScore.breakdown.empathy >= 70 ? 'bg-cyan-500' : 'bg-red-400'
                }`}
                style={{ width: `${toneScore.breakdown.empathy}%` }}
              />
            </div>
          </div>

          {/* Casualness */}
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-300 font-medium">Casual / Slang Level (Lower is safer)</span>
              <span className="font-mono text-slate-400">{toneScore.breakdown.casualness}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  toneScore.breakdown.casualness > 50 ? 'bg-orange-500' : 'bg-slate-500'
                }`}
                style={{ width: `${toneScore.breakdown.casualness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Tone Critique Quote */}
      <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed font-sans">
        <span className="font-semibold text-blue-400">Tone Analysis Critique: </span>
        {toneScore.critique}
      </div>
    </div>
  );
};
