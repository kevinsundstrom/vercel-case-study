import { NextRequest, NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { contentPipelineWorkflow } from '../../../../src/workflow/contentPipeline';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let outline: string | undefined;
  let urls: string[] | undefined;

  try {
    const body = await request.json();
    if (typeof body?.outline === 'string' && body.outline.trim().length > 0) {
      outline = body.outline.trim();
    }
    if (Array.isArray(body?.urls)) {
      urls = body.urls.filter((u: unknown) => typeof u === 'string');
    }
  } catch { /* no body — outline is required */ }

  if (!outline) {
    return NextResponse.json({ error: 'outline is required' }, { status: 400 });
  }

  const run = await start(contentPipelineWorkflow, [{ outline, urls }]);
  return NextResponse.json({ runId: run.runId }, { status: 202 });
}
