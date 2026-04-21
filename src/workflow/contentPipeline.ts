'use workflow';

import { research } from '../agents/researcher';
import { write } from '../agents/writer';
import { factCheck } from '../agents/factChecker';
import { repair } from '../agents/repair';
import { lint, formatReport } from '../lib/linter';
import { commitDraftToRepo } from '../lib/artifacts.github';
import { generateRunId } from '../lib/ids';

const MAX_REPAIR_ITERATIONS = 3;

export interface PipelineParams {
  outline: string;
}

export interface PipelineResult {
  runId: string;
  draftUrl: string;
  lintIterations: number;
  clean: boolean;
}

async function stepResearch(outline: string): Promise<string> {
  'use step';
  return research(outline);
}

async function stepWrite(outline: string, notes: string): Promise<string> {
  'use step';
  return write(outline, notes);
}

async function stepFactCheck(draft: string, reference: string): Promise<string> {
  'use step';
  return factCheck(draft, reference);
}

async function stepRepair(draft: string, report: string): Promise<string> {
  'use step';
  return repair(draft, report);
}

async function stepSave(runId: string, draft: string): Promise<string> {
  'use step';
  return commitDraftToRepo(runId, draft);
}

export async function contentPipelineWorkflow({ outline }: PipelineParams): Promise<PipelineResult> {
  const runId = generateRunId();

  const notes = await stepResearch(outline);
  let draft = await stepWrite(outline, notes);
  draft = await stepFactCheck(draft, outline);

  let lintIterations = 0;
  let clean = false;

  for (let i = 0; i < MAX_REPAIR_ITERATIONS; i++) {
    const report = lint(draft);
    if (report.clean) {
      clean = true;
      break;
    }
    draft = await stepRepair(draft, formatReport(report));
    lintIterations++;
  }

  const draftUrl = await stepSave(runId, draft);
  return { runId, draftUrl, lintIterations, clean };
}
