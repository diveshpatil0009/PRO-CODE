export type UserRole = 'creator' | 'reviewer' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
  department: string;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type CheckType = 'tone' | 'terminology' | 'factual' | 'visual' | 'multilingual' | 'conflict';

export type FindingStatus = 'detected' | 'corrected' | 'ignored' | 'clarification_needed';

export interface BrandRule {
  id: string;
  code: string; // e.g. "RULE-TONE-01"
  category: 'Tone & Voice' | 'Terminology' | 'Visual Identity' | 'Legal & Compliance' | 'Formatting' | 'Localization';
  title: string;
  description: string;
  sourceDoc: string;
  pageNumber?: number;
  section?: string;
  severity: SeverityLevel;
  ruleExcerpt: string;
  hasConflict?: boolean;
  conflictWithRuleId?: string;
  conflictDescription?: string;
  conflictResolution?: string;
  resolved?: boolean;
}

export interface LivingFact {
  id: string;
  factCode: string; // e.g. "FACT-2024-08"
  topic: string;
  approvedStatement: string;
  approvedStatistic?: string;
  sourceReference: string;
  sourceUrl?: string;
  verifiedBy: string;
  lastReviewedDate: string; // ISO date
  expiryDate: string; // ISO date
  isExpired: boolean;
  isExpiringSoon: boolean; // within 15 days
  status: 'active' | 'expiring' | 'expired' | 'archived';
  category: 'Metrics & Users' | 'Financial & Pricing' | 'Security & SLA' | 'Company Milestones' | 'Certifications';
}

export interface DictionaryTerm {
  id: string;
  prohibitedTerm: string;
  preferredAlternative: string;
  category: 'Tone Softener' | 'Brand Differentiator' | 'Legal Accuracy' | 'Product Precision';
  reason: string;
  severity: SeverityLevel;
  contextUsage: string;
  tags: string[];
}

export interface ToneScore {
  overallMatch: number; // 0 - 100%
  status: 'matched' | 'minor_deviation' | 'inconsistent';
  intendedTone: string;
  detectedTone: string;
  breakdown: {
    formality: number; // 0 - 100
    clarity: number;
    confidence: number;
    empathy: number;
    casualness: number;
  };
  critique: string;
}

export interface MultilingualAnalysis {
  targetLanguage: string;
  sourceLanguage: string;
  translationAccuracyScore: number;
  detectedInconsistencies: {
    sourcePhrase: string;
    targetPhrase: string;
    issue: string;
    suggestion: string;
    severity: SeverityLevel;
  }[];
}

export interface VisualCheckItem {
  id: string;
  checkName: string;
  description: string;
  passed: boolean;
  score: number;
  ruleReference: string;
  details: string;
  detectedHexColors?: string[];
  contrastRatio?: string;
  clearSpaceCompliant?: boolean;
}

export interface ComplianceFinding {
  id: string;
  type: CheckType;
  severity: SeverityLevel;
  title: string;
  description: string;
  highlightedText?: string;
  startIndex?: number;
  endIndex?: number;
  supportingEvidence: {
    ruleCode: string;
    ruleTitle: string;
    guidelineSection: string;
    sourceExcerpt: string;
  };
  suggestedCorrection: string;
  explanation: string;
  confidenceScore: number; // 0.0 - 1.0 (e.g. 0.95 = 95%)
  isUncertain: boolean; // Flagged for human verification
  uncertaintyReason?: string;
  status: FindingStatus;
  applied?: boolean;
}

export type ReviewStatus = 'draft' | 'under_review' | 'changes_requested' | 'approved' | 'rejected' | 'published';

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  timestamp: string;
  comment: string;
  actionTaken?: 'requested_changes' | 'approved' | 'clarified_rule' | 'general_comment';
}

export interface ContentVersion {
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  timestamp: string;
  author: string;
  authorRole: UserRole;
  title: string;
  body: string;
  complianceScore: number;
  status: ReviewStatus;
  changeSummary: string;
  activeFindingsCount: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  version: string;
  statusChange?: {
    from: ReviewStatus;
    to: ReviewStatus;
  };
}

export interface ContentSubmission {
  id: string;
  title: string;
  contentType: 'press_release' | 'social_copy' | 'blog_post' | 'marketing_ad' | 'technical_doc';
  originalText: string;
  currentText: string;
  creatorId: string;
  creatorName: string;
  targetAudience: string;
  targetLanguage: string;
  attachedImageUrl?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  activeVersion: string;
  versions: ContentVersion[];
  findings: ComplianceFinding[];
  toneScore?: ToneScore;
  multilingualAnalysis?: MultilingualAnalysis;
  visualChecks?: VisualCheckItem[];
  reviewComments: ReviewComment[];
  auditHistory: AuditEvent[];
  overallComplianceScore: number;
  assignedReviewerId?: string;
}

export interface GovernanceMetrics {
  totalContentReviewed: number;
  overallComplianceRate: number;
  pendingReviewsCount: number;
  expiredFactsCount: number;
  recurringViolations: {
    ruleCode: string;
    ruleTitle: string;
    violationCount: number;
    severity: SeverityLevel;
  }[];
  frequentBannedWords: {
    word: string;
    replacement: string;
    occurrences: number;
  }[];
  departmentCompliance: {
    department: string;
    reviewed: number;
    avgScore: number;
  }[];
  scoreTrends: {
    month: string;
    score: number;
  }[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface GroundingVerificationResult {
  claim: string;
  status: 'verified' | 'outdated' | 'contradicted' | 'unverifiable';
  verifiedAt: string;
  summary: string;
  details: string;
  recommendedPhrasing?: string;
  searchQueries: string[];
  sources: GroundingSource[];
  sourceModel: string;
  quotaExceeded?: boolean;
  notice?: string;
}
