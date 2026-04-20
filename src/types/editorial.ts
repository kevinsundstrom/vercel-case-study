import type { SectionId } from './core';

export interface SectionRenderingEntry {
  /** Whether to render a visible H2 heading for this section. */
  render: boolean;
  /** Heading text to use when render is true. Overrides the internal section title. */
  heading?: string;
  /** What role this section plays in the article. Passed to the writer as context. */
  purpose: string;
  /** Specific writing instructions for generating this section's content. */
  instructions: string;
}

/** Keyed by SectionId. Sections absent from the map fall back to defaults (render: true, title from contract). */
export type SectionRenderingConfig = Partial<Record<SectionId, SectionRenderingEntry>>;

export interface EditorialBriefAudience {
  role: string;
  context: string;
  priorKnowledge: string;
}

export interface EditorialBriefTone {
  style: 'technical' | 'analytical' | 'opinionated';
  verbosity: 'tight' | 'moderate';
}

export interface EditorialBriefConstraints {
  mustBeComparative: boolean;
  noGenericHeadings: boolean;
  noFluff: boolean;
}

export interface EditorialBrief {
  audience: EditorialBriefAudience;
  objective: string;
  coreThesis: string;
  keyTensions: string[];
  readerTakeaway: string;
  tone: EditorialBriefTone;
  constraints: EditorialBriefConstraints;
}
