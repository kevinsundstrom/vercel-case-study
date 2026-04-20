import type { RunManifest, SourcePlan, ComparisonDimensionKey } from '../types';
import { runPlanner } from '../agents/planner';
import { comparisonDimensions } from '../config/comparisonDimensions';

export interface PlanSourcesInput {
  manifest: RunManifest;
}

export interface PlanSourcesOutput {
  manifest: RunManifest;
  sourcePlan: SourcePlan;
}

/**
 * Uses the planner agent to produce a SourcePlan: research questions and candidate
 * documentation URLs for each vendor. Does not fetch any content.
 */
export async function planSources(input: PlanSourcesInput): Promise<PlanSourcesOutput> {
  const manifest: RunManifest = {
    ...input.manifest,
    status: 'planning',
    currentStage: 'planSources',
    updatedAt: new Date().toISOString(),
  };

  const targetDimensions = comparisonDimensions.map(d => d.key) as ComparisonDimensionKey[];

  const sourcePlan = await runPlanner({
    topic: manifest.topic,
    runId: manifest.runId,
    targetDimensions,
  });

  return {
    manifest: { ...manifest, updatedAt: new Date().toISOString() },
    sourcePlan,
  };
}
