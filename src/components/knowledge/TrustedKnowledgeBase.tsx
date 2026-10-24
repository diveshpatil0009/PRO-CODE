import React, { useState } from 'react';
import {
  Database,
  BookMarked,
  Scale,
  Radar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LivingFact, DictionaryTerm, BrandRule, User } from '../../types/governance';
import { LivingFactSheet } from './LivingFactSheet';
import { BannedWordDictionary } from './BannedWordDictionary';
import { ConflictingRulesResolver } from './ConflictingRulesResolver';

interface TrustedKnowledgeBaseProps {
  facts: LivingFact[];
  onUpdateFact: (fact: LivingFact) => void;
  onAddFact: (fact: LivingFact) => void;
  terms: DictionaryTerm[];
  onAddTerm: (term: DictionaryTerm) => void;
  rules: BrandRule[];
  onResolveConflict: (ruleId1: string, ruleId2: string, resolutionChoice: string) => void;
  currentUser: User;
  onProceed: () => void;
}

export const TrustedKnowledgeBase: React.FC<TrustedKnowledgeBaseProps> = ({
  facts,
  onUpdateFact,
  onAddFact,
  terms,
  onAddTerm,
  rules,
  onResolveConflict,
  currentUser,
  onProceed,
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'dictionary' | 'conflicts'>('facts');

  const conflictingCount = rules.filter((r) => r.hasConflict && !r.resolved).length;
  const expiredFactsCount = facts.filter((f) => f.isExpired || f.status === 'expired').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-blue-900/30 border border-indigo-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Single Source of Truth
              </span>
              <span className="text-xs text-slate-400">
                Living Governance Database
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Trusted Brand Knowledge Base
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Centralized repository storing approved facts, current statistics, preferred and prohibited vocabulary,
              and expiry dates. Automatically flags contradictory guidelines for authorized clarification.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs font-medium max-w-xl">
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition ${
            activeTab === 'facts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Living Fact Sheet</span>
          {expiredFactsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {expiredFactsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition ${
            activeTab === 'dictionary'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Banned & Approved Words</span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full">
            {terms.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition ${
            activeTab === 'conflicts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Conflicting Rules</span>
          {conflictingCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {conflictingCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'facts' && (
        <LivingFactSheet
          facts={facts}
          onUpdateFact={onUpdateFact}
          onAddFact={onAddFact}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'dictionary' && (
        <BannedWordDictionary
          terms={terms}
          onAddTerm={onAddTerm}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'conflicts' && (
        <ConflictingRulesResolver
          rules={rules}
          onResolveConflict={onResolveConflict}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
