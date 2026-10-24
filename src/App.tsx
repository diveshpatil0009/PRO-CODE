import React, { useState, useEffect } from 'react';
import {
  User,
  BrandRule,
  LivingFact,
  DictionaryTerm,
  ContentSubmission,
  GovernanceMetrics,
  ReviewStatus,
} from './types/governance';
import {
  INITIAL_USERS,
  INITIAL_RULES,
  INITIAL_FACTS,
  INITIAL_DICTIONARY,
  INITIAL_SUBMISSIONS,
  INITIAL_METRICS,
  getStoredData,
  saveStoredData,
} from './data/mockDatabase';
import {
  runBrandComplianceAnalysis,
  applyFindingCorrection,
} from './services/complianceEngine';

// Layout Components
import { AppSidebar, MainNavView } from './components/layout/AppSidebar';
import { AppNavbar } from './components/layout/AppNavbar';

// Views - Individual Features of Procode
import { ContentReviewStudio } from './components/studio/ContentReviewStudio';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { BrandKnowledgeSetup } from './components/setup/BrandKnowledgeSetup';
import { LivingFactSheet } from './components/knowledge/LivingFactSheet';
import { BannedWordDictionary } from './components/knowledge/BannedWordDictionary';
import { ConflictingRulesResolver } from './components/knowledge/ConflictingRulesResolver';
import { VisualComplianceModal } from './components/visual/VisualComplianceModal';
import { BrandToneIdentifier } from './components/report/BrandToneIdentifier';
import { CrossLanguageGuardian } from './components/report/CrossLanguageGuardian';
import { ExplainableQualityReport } from './components/report/ExplainableQualityReport';
import { HumanReviewModal } from './components/review/HumanReviewModal';
import { SubmissionsHistoryView } from './components/history/SubmissionsHistoryView';
import { GovernanceInsightsDashboard } from './components/dashboard/GovernanceInsightsDashboard';

// Modals
import { BackendArchitectureModal } from './components/architecture/BackendArchitectureModal';

export default function App() {
  // Theme State: 'dark' (matching screenshot) or 'light' (white background)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('procode_theme') as 'dark' | 'light') || 'dark';
  });

  // Mock PostgreSQL state
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Sarah Chen (Brand Director)
  const [rules, setRules] = useState<BrandRule[]>(() => getStoredData().rules);
  const [facts, setFacts] = useState<LivingFact[]>(() => getStoredData().facts);
  const [dictionary, setDictionary] = useState<DictionaryTerm[]>(() => getStoredData().dictionary);
  const [submissions, setSubmissions] = useState<ContentSubmission[]>(() => getStoredData().submissions);
  const [metrics, setMetrics] = useState<GovernanceMetrics>(() => getStoredData().metrics);

  // Standalone Feature Navigation
  const [currentView, setCurrentView] = useState<MainNavView>('review_studio');

  // Active submission
  const [activeSubId, setActiveSubId] = useState<string>(submissions[0]?.id || 'sub-001');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showArchModal, setShowArchModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showVisualModal, setShowVisualModal] = useState(false);

  // Persist theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('procode_theme', next);
  };

  // Persist storage
  useEffect(() => {
    saveStoredData({
      rules,
      facts,
      dictionary,
      submissions,
      metrics,
    });
  }, [rules, facts, dictionary, submissions, metrics]);

  const activeSubmission =
    submissions.find((s) => s.id === activeSubId) || submissions[0];

  // Rule Handlers
  const handleAddRule = (newRule: BrandRule) => {
    setRules((prev) => [newRule, ...prev]);
  };

  const handleResolveConflict = (ruleId1: string, ruleId2: string, resolutionChoice: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId1 || r.id === ruleId2
          ? { ...r, resolved: true, conflictResolution: resolutionChoice }
          : r
      )
    );

    if (activeSubmission) {
      const updatedFindings = activeSubmission.findings.map((f) => {
        if (f.type === 'conflict') {
          return {
            ...f,
            status: 'corrected' as const,
            applied: true,
            suggestedCorrection: 'Resolved: Short headline with full trademark subtitle',
          };
        }
        return f;
      });

      const updatedSub: ContentSubmission = {
        ...activeSubmission,
        findings: updatedFindings,
        overallComplianceScore: Math.min(100, activeSubmission.overallComplianceScore + 10),
      };

      setSubmissions((prev) =>
        prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
      );
    }
  };

  // Fact Handlers
  const handleUpdateFact = (updatedFact: LivingFact) => {
    setFacts((prev) => prev.map((f) => (f.id === updatedFact.id ? updatedFact : f)));
  };

  const handleAddFact = (newFact: LivingFact) => {
    setFacts((prev) => [newFact, ...prev]);
  };

  // Dictionary Handlers
  const handleAddTerm = (newTerm: DictionaryTerm) => {
    setDictionary((prev) => [newTerm, ...prev]);
  };

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState<string | null>(null);

  // Re-analyse active submission text via Gemini 3.8 Flash / Smart Compliance Engine
  const handleReanalyseText = async (customContent?: string) => {
    if (!activeSubmission) return;

    const targetText = customContent !== undefined ? customContent : activeSubmission.currentText;
    setIsAnalyzing(true);
    setAiScanStatus('Checking tone pillars, living facts, and terminology with Gemini 3.8 Flash...');

    try {
      const guidelinesSummary = rules
        .slice(0, 8)
        .map((r) => `[${r.code}] ${r.title}: ${r.description}`)
        .join('\n');
      const factsSummary = facts
        .map((f) => `${f.topic}: ${f.approvedStatement} ${f.approvedStatistic || ''} (Status: ${f.status}, Expiry: ${f.expiryDate})`)
        .join('\n');
      const termsSummary = dictionary
        .map((d) => `"${d.prohibitedTerm}" -> use "${d.preferredAlternative}" (${d.reason})`)
        .join('\n');

      let aiResult: any = null;
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: targetText,
            guidelinesContext: guidelinesSummary,
            livingFacts: factsSummary,
            prohibitedTerms: termsSummary,
            targetLanguage: activeSubmission.targetLanguage,
          }),
        });

        if (response.ok) {
          aiResult = await response.json();
        }
      } catch (e) {
        console.warn('Backend /api/analyze unavailable, continuing with client engine', e);
      }

      // If AI returned structured findings
      if (aiResult && aiResult.findings && Array.isArray(aiResult.findings)) {
        const updatedFindings = aiResult.findings.map((f: any, idx: number) => ({
          id: f.id || `finding-ai-${idx}-${Date.now()}`,
          type: f.type || 'terminology',
          severity: f.severity || 'medium',
          title: f.title || 'Brand Finding',
          highlightedText: f.highlightedText || '',
          ruleCode: f.ruleCode || 'RULE-01',
          ruleTitle: f.ruleTitle || 'Brand Governance Standard',
          suggestedCorrection: f.suggestedCorrection || '',
          explanation: f.explanation || '',
          confidenceScore: f.confidenceScore || 0.95,
          isUncertain: f.isUncertain || false,
          status: 'pending',
          applied: false,
        }));

        const existingTone = activeSubmission.toneScore || {
          overallMatch: 85,
          status: 'matched' as const,
          intendedTone: 'Authoritative, Warm, Enterprise',
          detectedTone: 'Professional corporate draft',
          breakdown: { formality: 85, clarity: 90, confidence: 85, empathy: 80, casualness: 20 },
          critique: 'Professional tone aligned with brand principles.',
        };

        const updatedSub: ContentSubmission = {
          ...activeSubmission,
          currentText: targetText,
          findings: updatedFindings,
          overallComplianceScore: aiResult.overallComplianceScore || 82,
          toneScore: {
            ...existingTone,
            overallMatch: aiResult.toneMatchScore || 85,
            detectedTone: aiResult.detectedTone || existingTone.detectedTone,
            status: (aiResult.toneMatchScore || 85) >= 90 ? 'matched' : (aiResult.toneMatchScore || 85) >= 75 ? 'minor_deviation' : 'inconsistent',
            critique: aiResult.critique || existingTone.critique,
          },
        };

        setSubmissions((prev) =>
          prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
        );
        setAiScanStatus(`Analysis complete (${aiResult.source || 'AI Engine'})`);
      } else {
        // Fallback to local compliance engine
        const analysis = runBrandComplianceAnalysis({
          title: activeSubmission.title,
          text: targetText,
          targetLanguage: activeSubmission.targetLanguage,
          targetAudience: activeSubmission.targetAudience,
          contentType: activeSubmission.contentType,
          imageUrl: activeSubmission.attachedImageUrl,
          rules,
          facts,
          dictionary,
        });

        const updatedSub: ContentSubmission = {
          ...activeSubmission,
          currentText: targetText,
          findings: analysis.findings,
          toneScore: analysis.toneScore,
          multilingualAnalysis: analysis.multilingualAnalysis,
          overallComplianceScore: analysis.overallScore,
        };

        setSubmissions((prev) =>
          prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
        );
        setAiScanStatus('Compliance scan updated successfully');
      }
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAiScanStatus(null), 3000);
    }
  };

  // Update submission text from direct edit
  const handleUpdateSubmissionText = (text: string) => {
    if (!activeSubmission) return;

    const updatedSub: ContentSubmission = {
      ...activeSubmission,
      currentText: text,
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  // Apply finding correction
  const handleApplyCorrection = (findingId: string) => {
    if (!activeSubmission) return;

    const finding = activeSubmission.findings.find((f) => f.id === findingId);
    if (!finding) return;

    const updatedText = applyFindingCorrection(activeSubmission.currentText, finding);

    const updatedFindings = activeSubmission.findings.map((f) =>
      f.id === findingId ? { ...f, applied: true, status: 'corrected' as const } : f
    );

    const unappliedCount = updatedFindings.filter((f) => !f.applied).length;
    const newScore = unappliedCount === 0 ? 98 : Math.min(96, activeSubmission.overallComplianceScore + 14);

    const updatedSub: ContentSubmission = {
      ...activeSubmission,
      currentText: updatedText,
      findings: updatedFindings,
      overallComplianceScore: newScore,
      activeVersion: 'v1.1',
      auditHistory: [
        ...activeSubmission.auditHistory,
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: currentUser.role,
          action: 'Correction Applied',
          details: `Replaced non-compliant phrase with: "${finding.suggestedCorrection}".`,
          version: 'v1.1',
        },
      ],
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  // Apply all corrections at once
  const handleApplyAllCorrections = () => {
    if (!activeSubmission) return;

    let text = activeSubmission.currentText;
    const updatedFindings = activeSubmission.findings.map((f) => {
      text = applyFindingCorrection(text, f);
      return { ...f, applied: true, status: 'corrected' as const };
    });

    const updatedSub: ContentSubmission = {
      ...activeSubmission,
      currentText: text,
      findings: updatedFindings,
      overallComplianceScore: 98,
      activeVersion: 'v1.2',
      auditHistory: [
        ...activeSubmission.auditHistory,
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actorRole: currentUser.role,
          action: 'Batch Corrections Applied',
          details: 'Applied all intent-preserving vocabulary and living fact suggestions.',
          version: 'v1.2',
        },
      ],
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  // Update Review Status
  const handleUpdateStatus = (newStatus: ReviewStatus, note?: string) => {
    if (!activeSubmission) return;

    const newVersion = newStatus === 'approved' ? 'v2.0 (Approved)' : activeSubmission.activeVersion;

    const auditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorRole: currentUser.role,
      action:
        newStatus === 'approved'
          ? 'Authorized Brand Approval'
          : newStatus === 'changes_requested'
          ? 'Changes Requested'
          : 'Content Rejected',
      details: note || `Reviewer action: ${newStatus}`,
      version: newVersion,
      statusChange: { from: activeSubmission.status, to: newStatus },
    };

    const newComment = note
      ? [
          {
            id: `comm-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            comment: note,
            actionTaken:
              newStatus === 'approved'
                ? ('approved' as const)
                : ('requested_changes' as const),
          },
        ]
      : [];

    const updatedSub: ContentSubmission = {
      ...activeSubmission,
      status: newStatus,
      activeVersion: newVersion,
      reviewComments: [...activeSubmission.reviewComments, ...newComment],
      auditHistory: [...activeSubmission.auditHistory, auditEntry],
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  const handleAddReviewComment = (comment: string) => {
    if (!activeSubmission) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      comment,
      actionTaken: 'general_comment' as const,
    };

    const updatedSub: ContentSubmission = {
      ...activeSubmission,
      reviewComments: [...activeSubmission.reviewComments, newComment],
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-ambient-dark text-slate-100' : 'bg-ambient-light text-slate-900'
      }`}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Organized into standalone individual features) */}
        <AppSidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          theme={theme}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar with Search & Dark/White Toggle */}
          <AppNavbar
            currentUser={currentUser}
            users={users}
            onSelectUser={setCurrentUser}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenArchitecture={() => setShowArchModal(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Standalone Feature Views */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* FEATURE 1: Content Review Studio (Matching Screenshot UI) */}
            {currentView === 'review_studio' && (
              <ContentReviewStudio
                submission={activeSubmission}
                currentUser={currentUser}
                theme={theme}
                isAnalyzing={isAnalyzing}
                aiScanStatus={aiScanStatus}
                onUpdateSubmissionText={handleUpdateSubmissionText}
                onApplyCorrection={handleApplyCorrection}
                onApplyAllCorrections={handleApplyAllCorrections}
                onUpdateStatus={handleUpdateStatus}
                onReanalyse={handleReanalyseText}
                onOpenEvidenceModal={() => setShowEvidenceModal(true)}
              />
            )}

            {/* FEATURE 2: Executive Dashboard */}
            {currentView === 'dashboard' && (
              <ExecutiveDashboard
                submissions={submissions}
                metrics={metrics}
                facts={facts}
                currentUser={currentUser}
                theme={theme}
                onGoToReviewStudio={(subId) => {
                  if (subId) setActiveSubId(subId);
                  setCurrentView('review_studio');
                }}
                onGoToKnowledgeBase={() => setCurrentView('guidelines')}
                onGoToWorkflow={() => setCurrentView('review_studio')}
              />
            )}

            {/* FEATURE 3: Brand Guidelines & Rule Ingestion */}
            {currentView === 'guidelines' && (
              <BrandKnowledgeSetup
                rules={rules}
                onAddRule={handleAddRule}
                onAddTerm={handleAddTerm}
                currentUser={currentUser}
                theme={theme}
                onProceed={() => setCurrentView('facts')}
              />
            )}

            {/* FEATURE 4: Living Fact Sheet & Expiry Radar */}
            {currentView === 'facts' && (
              <LivingFactSheet
                facts={facts}
                onUpdateFact={handleUpdateFact}
                onAddFact={handleAddFact}
                currentUser={currentUser}
                theme={theme}
              />
            )}

            {/* FEATURE 5: Banned & Approved Word Dictionary */}
            {currentView === 'dictionary' && (
              <BannedWordDictionary
                terms={dictionary}
                onAddTerm={handleAddTerm}
                currentUser={currentUser}
                theme={theme}
              />
            )}

            {/* FEATURE 6: Conflicting Rules Resolver */}
            {currentView === 'conflicts' && (
              <ConflictingRulesResolver
                rules={rules}
                onResolveConflict={handleResolveConflict}
                currentUser={currentUser}
                theme={theme}
              />
            )}

            {/* FEATURE 7: Visual & Logo Compliance Inspector */}
            {currentView === 'visual_checker' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white">Visual & Logo Compliance Inspector</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Validates logo minimum 24px clear space padding, brand palette matching, and WCAG AA contrast ratio.
                  </p>
                </div>
                <button
                  onClick={() => setShowVisualModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Open Visual Inspector Modal
                </button>
              </div>
            )}

            {/* FEATURE 8: Tone & Cross-Language Guardian */}
            {currentView === 'tone_guardian' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-blue-900/30 border border-indigo-500/30 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white">Tone & Cross-Language Guardian</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simultaneous verification of executive brand tone pillars and international translation fidelity.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BrandToneIdentifier toneScore={activeSubmission.toneScore} />
                  <CrossLanguageGuardian analysis={activeSubmission.multilingualAnalysis} />
                </div>
              </div>
            )}

            {/* FEATURE 9: Human Review & Approval System */}
            {currentView === 'approvals' && (
              <HumanReviewModal
                submission={activeSubmission}
                currentUser={currentUser}
                onUpdateStatus={handleUpdateStatus}
                onAddComment={handleAddReviewComment}
                onProceedToFinalise={() => setCurrentView('history')}
              />
            )}

            {/* FEATURE 10: Version History & Audit Log */}
            {currentView === 'history' && (
              <SubmissionsHistoryView
                submissions={submissions}
                theme={theme}
                onSelectSubmissionForStudio={(subId) => {
                  setActiveSubId(subId);
                  setCurrentView('review_studio');
                }}
              />
            )}

            {/* FEATURE 11: Governance Insights Dashboard */}
            {currentView === 'insights' && (
              <GovernanceInsightsDashboard
                metrics={metrics}
                onNavigateToWorkflow={() => setCurrentView('review_studio')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Backend Architecture & PostgreSQL DDL Modal */}
      <BackendArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />

      {/* Visual Inspector Modal */}
      <VisualComplianceModal
        isOpen={showVisualModal}
        onClose={() => setShowVisualModal(false)}
        imageUrl={activeSubmission.attachedImageUrl}
        visualChecks={activeSubmission.visualChecks}
      />

      {/* Detailed Evidence Report Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Detailed AI Evidence & Grounding Report
              </h3>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <ExplainableQualityReport
              submission={activeSubmission}
              onApplyCorrection={handleApplyCorrection}
              onApplyAllCorrections={handleApplyAllCorrections}
              onProceedToReview={() => {
                setShowEvidenceModal(false);
                setCurrentView('approvals');
              }}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
