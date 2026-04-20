import type { ClaimType, ComparisonDimensionKey, ComparisonSubject, EvidenceSourceType, SectionId } from './core';

export interface Evidence {
  id: string;
  /** ID of the EvidenceSource in the EvidencePack. */
  sourceId: string;
  /** Verbatim quote from the source. */
  quote: string;
  /** Brief context sentence situating the quote. */
  context: string;
}

/** Pre-normalization extract produced by the researcher agent during extractEvidence. */
export interface RawExtract {
  id: string;
  sourceId: string;
  quote: string;
  context: string;
  /** Suggested dimension from the researcher — hypothesis, not ground truth. */
  dimensionHint?: ComparisonDimensionKey;
}

export interface Claim {
  id: string;
  type: ClaimType;
  text: string;
  subject: ComparisonSubject;
  /** The article section this claim supports. */
  sectionRef: SectionId;
  /** Required when type === 'sourced'. Links to Evidence.id entries. */
  evidenceIds: string[];
  /** Required when type === 'derived' or 'interpretive'. Links to parent Claim.id entries. */
  parentClaimIds: string[];
  notes?: string;
}

export interface EvidenceSource {
  id: string;
  url: string;
  title: string;
  type: EvidenceSourceType;
  retrievedAt: string;
  /** The most relevant excerpt from this source. */
  excerpt: string;
}

export interface ClaimLedger {
  runId: string;
  claims: Claim[];
  /** All evidence items referenced by claims in this ledger. */
  evidence: Evidence[];
  /** All sources referenced by evidence items. */
  sources: EvidenceSource[];
  createdAt: string;
}
