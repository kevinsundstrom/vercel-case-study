import type { RunManifest, RunConfig } from '../types';
import { generateRunId } from '../lib/ids';

export interface InitializeRunInput {
  topic: string;
  config: RunConfig;
}

export interface InitializeRunOutput {
  manifest: RunManifest;
}

/** Creates a RunManifest and seeds the pipeline context for a new run. */
export async function initializeRun(input: InitializeRunInput): Promise<InitializeRunOutput> {
  const now = new Date().toISOString();
  const manifest: RunManifest = {
    runId: generateRunId(),
    topic: input.topic,
    status: 'initialized',
    currentStage: 'initializeRun',
    createdAt: now,
    updatedAt: now,
    config: input.config,
    artifactRefs: {},
  };
  return { manifest };
}
