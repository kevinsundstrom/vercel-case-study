'use workflow';

import { research } from '../agents/researcher';
import { write } from '../agents/writer';
import { factCheck } from '../agents/factChecker';
import { repair } from '../agents/repair';
import { lint, formatReport } from '../lib/linter';
import { saveMarkdownFileToBlob, saveArtifactToBlob } from '../lib/artifacts.blob';
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

async function stepFactCheck(draft: string, notes: string): Promise<string> {
  'use step';
  return factCheck(draft, notes);
}

async function stepRepair(draft: string, report: string): Promise<string> {
  'use step';
  return repair(draft, report);
}

async function stepSave(runId: string, draft: string, notes: string): Promise<string> {
  'use step';
  const [draftUrl] = await Promise.all([
    saveMarkdownFileToBlob(runId, 'articleDraft', draft),
    saveArtifactToBlob(runId, 'researchNotes', { notes }),
  ]);
  return draftUrl;
}

export async function contentPipelineWorkflow({ outline }: PipelineParams): Promise<PipelineResult> {
  const runId = generateRunId();

  const notes = await stepResearch(outline);
  let draft = await stepWrite(outline, notes);
  draft = await stepFactCheck(draft, notes);

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

  const draftUrl = await stepSave(runId, draft, notes);
  return { runId, draftUrl, lintIterations, clean };
}
