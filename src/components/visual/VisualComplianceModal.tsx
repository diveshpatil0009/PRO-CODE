import React, { useState } from 'react';
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Maximize2,
  Palette,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { VisualCheckItem } from '../../types/governance';

interface VisualComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  visualChecks?: VisualCheckItem[];
}

export const VisualComplianceModal: React.FC<VisualComplianceModalProps> = ({
  isOpen,
  onClose,
  imageUrl = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
  visualChecks = [],
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string>(imageUrl);
  const [showClearanceOverlay, setShowClearanceOverlay] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Feature #7
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Image & Visual Compliance Checker
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Brand Asset Clearance & Accessibility Inspector
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Visual Asset Preview with Clearance Overlay */}
          <div className="md:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group">
              <img
                src={selectedAsset}
                alt="Brand asset under review"
                className="w-full h-72 object-cover"
              />

              {/* Clearance Grid Overlay */}
              {showClearanceOverlay && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="border-2 border-dashed border-cyan-400 bg-cyan-500/10 rounded-xl p-6 relative">
                    <div className="absolute -top-3 left-4 bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                      CLEAR SPACE BOUNDING BOX: 28PX PADDING
                    </div>
                    {/* Simulated Logo Lockup */}
                    <div className="flex items-center space-x-2 bg-slate-900/90 px-4 py-2 rounded-lg border border-white/20 shadow-xl">
                      <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                        P
                      </div>
                      <span className="font-extrabold text-white text-xs tracking-wider">
                        PROCODE
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle Overlay Button */}
              <button
                onClick={() => setShowClearanceOverlay(!showClearanceOverlay)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 text-xs font-medium backdrop-blur-sm border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showClearanceOverlay ? 'Hide Clear Space Grid' : 'Show Clear Space Grid'}</span>
              </button>
            </div>

            {/* Palette swatch bar */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span>Detected Visual Palette Extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                {[
                  { hex: '#2563EB', name: 'Procode Royal Blue', match: true },
                  { hex: '#0F172A', name: 'Slate Dark 900', match: true },
                  { hex: '#10B981', name: 'Emerald Compliance Accent', match: true },
                  { hex: '#F8FAFC', name: 'Off-White Neutral', match: true },
                ].map((color, i) => (
                  <div key={i} className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[10px]">
                    <div
                      className="w-3.5 h-3.5 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-mono text-slate-300">{color.hex}</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnostic Checklist */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Automated Visual Governance Scorecard
            </div>

            <div className="space-y-2.5">
              {visualChecks.map((check) => (
                <div
                  key={check.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{check.checkName}</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{check.score}% PASS</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{check.description}</p>

                  <div className="text-[10px] bg-slate-900/80 p-2 rounded-lg text-slate-300 font-mono border border-slate-800">
                    › {check.details}
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Rule Reference: <span className="text-blue-300 font-mono">{check.ruleReference}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>All visual branding and accessibility standards verified for publishing.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Done Inspecting Visuals
          </button>
        </div>
      </div>
    </div>
  );
};
