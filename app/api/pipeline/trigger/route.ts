import { NextRequest, NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { contentPipelineWorkflow } from '../../../../src/workflow/contentPipeline';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let topic: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.topic === 'string' && body.topic.trim().length > 0) {
      topic = body.topic.trim();
    }
  } catch { /* no body — use default */ }

  const run = await start(contentPipelineWorkflow, [{ topic }]);
  return NextResponse.json({ runId: run.runId }, { status: 202 });
}
