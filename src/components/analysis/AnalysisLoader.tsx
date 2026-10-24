import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  BookOpen,
  Image,
  Globe2,
  Scale,
} from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete: () => void;
  documentTitle: string;
}

interface Stage {
  id: number;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  {
    id: 1,
    label: 'Brand Tone & Voice Identifier',
    detail: 'Evaluating formality, empathy, clarity, and confidence metrics against tone pillars...',
    icon: Sparkles,
  },
  {
    id: 2,
    label: 'Prohibited Vocabulary Dictionary Scan',
    detail: 'Matching text against banned terms (discount slang, absolute guarantees, hype words)...',
    icon: BookOpen,
  },
  {
    id: 3,
    label: 'Living Fact Sheet & Expiry Radar Validation',
    detail: 'Cross-referencing public numbers with audited statistics & checking review expiry dates...',
    icon: Search,
  },
  {
    id: 4,
    label: 'Cross-Language Brand Guardian Check',
    detail: 'Analyzing semantic alignment and detecting false translations in target language...',
    icon: Globe2,
  },
  {
    id: 5,
    label: 'Image Asset & Visual Clearance Check',
    detail: 'Verifying logo margin (24px min clear-space), brand palette, and contrast ratios...',
    icon: Image,
  },
  {
    id: 6,
    label: 'Contradictory Guidelines & Rule Conflict Resolver',
    detail: 'Checking for overlapping or paradoxical rules requiring reviewer clarification...',
    icon: Scale,
  },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  onComplete,
  documentTitle,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const totalDuration = 2400; // 2.4 seconds total smooth experience
    const intervalTime = 80;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const stageIndex = Math.min(
          STAGES.length - 1,
          Math.floor((next / 100) * STAGES.length)
        );
        setCurrentStageIdx(stageIndex);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Central Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-500/20">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>Intelligent Multi-Stage Governance Scan</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Analyzing Brand Compliance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evaluating <span className="text-slate-200 font-semibold font-mono">"{documentTitle}"</span> against verified rules and living facts.
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-blue-400 font-semibold">
              Step {currentStageIdx + 1} of {STAGES.length}
            </span>
            <span className="text-slate-300 font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 overflow-hidden ring-1 ring-slate-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages List */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 text-left space-y-3">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isDone = idx < currentStageIdx || progress >= 100;
            const isCurrent = idx === currentStageIdx && progress < 100;

            return (
              <div
                key={stage.id}
                className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-600/10 border border-blue-500/30 text-white'
                    : isDone
                    ? 'text-slate-300 opacity-90'
                    : 'text-slate-400 opacity-40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold leading-tight">
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                        Scanning...
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                        Verified ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-center space-x-2">
          <span>Powered by Deterministic Rule Validation & Gemini 3.8 Flash</span>
        </div>
      </div>
    </div>
  );
};
