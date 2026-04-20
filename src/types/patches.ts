import type { PatchOpType, PatchStrategy, SectionId } from './core';

export interface PatchOp {
  type: PatchOpType;
  sectionId: SectionId;
  /** Target span ID for span operations. */
  spanId?: string;
  /** 0-indexed paragraph position for paragraph operations. */
  paragraphIndex?: number;
  /** The span or paragraph ID to insert after. */
  afterId?: string;
  /** Replacement or insertion content. */
  newContent?: string;
}

export interface RejectedOp {
  op: PatchOp;
  reason: string;
}

export interface PatchRequest {
  runId: string;
  draftVersion: number;
  /** Verification or lint issue IDs this patch addresses. */
  issueIds: string[];
  ops: PatchOp[];
  rationale: string;
  requestedBy: 'repair_writer' | 'system';
  createdAt: string;
}

export interface PatchResponse {
  runId: string;
  sourceDraftVersion: number;
  resultDraftVersion: number;
  appliedOps: PatchOp[];
  rejectedOps: RejectedOp[];
  success: boolean;
  appliedAt: string;
}

export interface RepairStep {
  issueId: string;
  issueType: 'verification' | 'lint';
  strategy: PatchStrategy;
  patch: PatchRequest;
}

export interface RepairPlan {
  runId: string;
  draftVersion: number;
  iterationNumber: number;
  steps: RepairStep[];
  createdAt: string;
}
