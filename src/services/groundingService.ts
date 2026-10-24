import { GroundingVerificationResult } from '../types/governance';

const clientVerifyCache = new Map<string, GroundingVerificationResult>();
const clientAuditCache = new Map<string, any>();

export async function verifyClaimWithGoogleSearchGrounding(
  claim: string,
  context?: string
): Promise<GroundingVerificationResult> {
  const cacheKey = (claim || '').trim().toLowerCase();
  if (clientVerifyCache.has(cacheKey)) {
    return clientVerifyCache.get(cacheKey)!;
  }

  const response = await fetch('/api/verify-fact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim, context }),
  });

  if (!response.ok) {
    throw new Error(`Verification service returned status ${response.status}`);
  }

  const data: GroundingVerificationResult = await response.json();
  clientVerifyCache.set(cacheKey, data);
  return data;
}

export async function runDraftSearchGroundingAudit(content: string): Promise<{
  groundedAuditText: string;
  searchQueries: string[];
  sources: { title: string; url: string }[];
  verifiedAt: string;
  sourceModel: string;
  quotaExceeded?: boolean;
  notice?: string;
}> {
  const cacheKey = (content || '').slice(0, 100).trim();
  if (clientAuditCache.has(cacheKey)) {
    return clientAuditCache.get(cacheKey)!;
  }

  const response = await fetch('/api/grounded-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Search Grounding audit returned status ${response.status}`);
  }

  const data = await response.json();
  clientAuditCache.set(cacheKey, data);
  return data;
}
