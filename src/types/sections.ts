import type { ClaimType, SectionId } from './core';

export interface SectionContract {
  id: SectionId;
  title: string;
  required: boolean;
  /** Position in the final article (1-indexed). */
  order: number;
  minWords: number;
  maxWords: number;
  allowedClaimTypes: ClaimType[];
  notes: string;
}

export interface SectionContractSet {
  version: string;
  sections: SectionContract[];
}

export interface ArticleSection {
  id: SectionId;
  title: string;
  /** Rendered markdown content. */
  content: string;
  /** IDs of claims this section makes. */
  claimIds: string[];
  wordCount: number;
}
