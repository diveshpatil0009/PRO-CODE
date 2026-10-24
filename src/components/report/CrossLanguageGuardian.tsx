import React, { useState } from 'react';
import { Globe2, AlertTriangle, CheckCircle2, ArrowRight, Languages } from 'lucide-react';
import { MultilingualAnalysis } from '../../types/governance';

interface CrossLanguageGuardianProps {
  analysis?: MultilingualAnalysis;
  onLanguageChange?: (lang: string) => void;
}

export const CrossLanguageGuardian: React.FC<CrossLanguageGuardianProps> = ({
  analysis,
  onLanguageChange,
}) => {
  const [selectedLang, setSelectedLang] = useState(analysis?.targetLanguage || 'Spanish (ES)');

  const languages = [
    { code: 'Spanish (ES)', label: 'Spanish (ES/LATAM)' },
    { code: 'French (FR)', label: 'French (FR)' },
    { code: 'German (DE)', label: 'German (DE)' },
    { code: 'Hindi (IN)', label: 'Hindi (IN)' },
    { code: 'Japanese (JA)', label: 'Japanese (JA)' },
  ];

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const hasIssues = (analysis?.detectedInconsistencies?.length || 0) > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Feature #5
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Cross-Language Brand Guardian
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-indigo-400" />
            <span>Multilingual Brand Consistency & Slogan Guardian</span>
          </h3>
          <p className="text-xs text-slate-400">
            Detects translation nuance shifts, semantic divergence, and false connotations across international markets
          </p>
        </div>

        {/* Language selector chips */}
        <div className="flex flex-wrap gap-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                selectedLang === l.code
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Language Status */}
      <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300">
            Testing target translation: <strong className="text-white">{selectedLang}</strong>
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-slate-400 text-[11px]">Translation Loyalty:</span>
          <span className={`font-bold ${hasIssues ? 'text-amber-400' : 'text-emerald-400'}`}>
            {analysis?.translationAccuracyScore || 88}%
          </span>
        </div>
      </div>

      {/* Issues or Clean State */}
      {hasIssues ? (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {analysis?.detectedInconsistencies.length} Translation Inconsistency Detected
            </span>
          </div>

          {analysis?.detectedInconsistencies.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-amber-500/30 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Semantic Drift Warning
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {item.severity}
                </span>
              </div>

              {/* Translation Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Source Concept (EN)</div>
                  <div className="font-semibold text-slate-200">"{item.sourcePhrase}"</div>
                </div>
                <div>
                  <div className="text-[10px] text-red-400 font-medium">Problematic Literal Translation</div>
                  <div className="font-semibold text-red-300 line-through">"{item.targetPhrase}"</div>
                </div>
              </div>

              <div className="text-slate-300 text-[11px]">
                <strong className="text-slate-200">Issue: </strong>
                {item.issue}
              </div>

              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Approved Regional Term: </strong>"{item.suggestion}"
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <strong>Cross-Language Guardian Verified: </strong>
            No unapproved idioms, false friends, or slogan mistranslations found for {selectedLang}.
          </div>
        </div>
      )}
    </div>
  );
};
