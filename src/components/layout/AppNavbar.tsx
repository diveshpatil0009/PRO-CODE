import React, { useState } from 'react';
import {
  Search,
  Mail,
  Bell,
  Sun,
  Moon,
  Database,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { User } from '../../types/governance';

interface AppNavbarProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenArchitecture: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentUser,
  users,
  onSelectUser,
  theme,
  onToggleTheme,
  onOpenArchitecture,
  searchQuery,
  onSearchChange,
}) => {
  const isDark = theme === 'dark';
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between transition-colors z-20 ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-200 backdrop-blur-md'
          : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md'
      }`}
    >
      {/* Search Bar (Matching Screenshot) */}
      <div className="relative w-72 sm:w-96">
        <Search
          className={`w-4 h-4 absolute left-3 top-2.5 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search brand guidelines, living facts, or content..."
          className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
              : 'bg-slate-100/80 border-slate-200 text-slate-800 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Right Controls: Mail, Bell, Dark/White Mode Toggle, User Profile */}
      <div className="flex items-center space-x-3">
        {/* Backend & DB Modal Trigger */}
        <button
          onClick={onOpenArchitecture}
          title="Inspect PostgreSQL Schema & Python API"
          className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>PostgreSQL / Python API</span>
        </button>

        {/* DARK / WHITE THEME TOGGLE BUTTON */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to White Mode' : 'Switch to Dark Mode'}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-cyan-300'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
          }`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">White Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Mail Icon */}
        <button
          className={`p-2 rounded-xl border transition ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
        </button>

        {/* Notification Bell with Badge */}
        <button
          className={`p-2 rounded-xl border relative transition ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* Clean Permission Role Selector (No Personal Profile or Avatars) */}
        <div className="relative">
          <div
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer transition select-none ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="text-xs font-semibold">
              Role:{' '}
              <span className="text-cyan-400 font-bold capitalize">
                {currentUser.role === 'manager'
                  ? 'Brand Director (Sign-off)'
                  : currentUser.role === 'reviewer'
                  ? 'Compliance Reviewer'
                  : 'Content Creator'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {showUserDropdown && (
            <div
              className={`absolute right-0 mt-2 w-52 rounded-2xl p-2 border shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 mb-1">
                Select Active Role
              </div>
              {[
                { role: 'manager' as const, label: 'Brand Director', desc: 'Can sign off & approve' },
                { role: 'reviewer' as const, label: 'Compliance Reviewer', desc: 'Can request changes' },
                { role: 'creator' as const, label: 'Content Creator', desc: 'Can draft & submit' },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    const found = users.find((u) => u.role === r.role) || {
                      ...currentUser,
                      role: r.role,
                      title: r.label,
                    };
                    onSelectUser(found);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex flex-col px-3 py-2 rounded-xl text-left transition ${
                    currentUser.role === r.role
                      ? isDark
                        ? 'bg-cyan-500/10 text-cyan-300 font-bold'
                        : 'bg-cyan-50 text-cyan-700 font-bold'
                      : isDark
                      ? 'hover:bg-slate-800 text-slate-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-semibold">{r.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
