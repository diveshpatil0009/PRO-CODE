import React from 'react';
import {
  FileCheck2,
  LayoutDashboard,
  FileUp,
  Database,
  BookMarked,
  Scale,
  Image as ImageIcon,
  Globe2,
  UserCheck,
  History,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

export type MainNavView =
  | 'review_studio'
  | 'dashboard'
  | 'guidelines'
  | 'facts'
  | 'dictionary'
  | 'conflicts'
  | 'visual_checker'
  | 'tone_guardian'
  | 'approvals'
  | 'history'
  | 'insights';

interface AppSidebarProps {
  currentView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  theme: 'dark' | 'light';
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onSelectView,
  theme,
}) => {
  const isDark = theme === 'dark';

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        {
          id: 'review_studio' as MainNavView,
          label: 'Content Review Studio',
          icon: FileCheck2,
          badge: 'Live',
        },
        {
          id: 'dashboard' as MainNavView,
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'BRAND KNOWLEDGE',
      items: [
        {
          id: 'guidelines' as MainNavView,
          label: 'Guidelines & Rule Ingestion',
          icon: FileUp,
        },
        {
          id: 'facts' as MainNavView,
          label: 'Living Fact Sheet',
          icon: Database,
          badge: 'Search Grounded',
        },
        {
          id: 'dictionary' as MainNavView,
          label: 'Banned Word Dictionary',
          icon: BookMarked,
        },
        {
          id: 'conflicts' as MainNavView,
          label: 'Conflicting Rules Resolver',
          icon: Scale,
        },
      ],
    },
    {
      title: 'COMPLIANCE CHECKS',
      items: [
        {
          id: 'visual_checker' as MainNavView,
          label: 'Visual & Logo Compliance',
          icon: ImageIcon,
        },
        {
          id: 'tone_guardian' as MainNavView,
          label: 'Tone & Language Guardian',
          icon: Globe2,
        },
      ],
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        {
          id: 'approvals' as MainNavView,
          label: 'Human Review & Approval',
          icon: UserCheck,
        },
        {
          id: 'history' as MainNavView,
          label: 'Version History & Audit Log',
          icon: History,
        },
        {
          id: 'insights' as MainNavView,
          label: 'Governance Insights',
          icon: BarChart3,
        },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between p-4 border-r transition-colors z-30 select-none overflow-y-auto ${
        isDark
          ? 'bg-slate-950/95 border-slate-800/80 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* Top Branding (Matching Screenshot) */}
      <div className="space-y-6">
        <div className="px-2 pt-1 flex items-center justify-between">
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => onSelectView('review_studio')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-pink-500 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            {/* Glowing Procode Logo (Cyan to Pink Gradient from Screenshot) */}
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              Procode
            </span>
          </div>

          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-blue-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}
          >
            v1.0
          </span>
        </div>

        {/* Individual Feature Navigation Sections */}
        <div className="space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div
                className={`px-3 text-[10px] font-extrabold uppercase tracking-wider ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? isDark
                            ? 'bg-slate-900 text-white border border-slate-700/80 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isActive
                              ? 'text-cyan-400'
                              : isDark
                              ? 'text-slate-500 group-hover:text-slate-300'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Card (Enterprise Governance Status - Developer profile section removed completely) */}
      <div
        className={`p-3 rounded-2xl border text-xs mt-6 transition-all ${
          isDark
            ? 'bg-slate-900/60 border-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[11px]">Brand Shield: Active</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Google Search
          </span>
        </div>
        <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Live Google Search Grounding with gemini-3.8-flash cross-references claims against verified web data.
        </p>
      </div>
    </aside>
  );
};
