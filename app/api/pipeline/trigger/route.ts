import { NextRequest, NextResponse } from 'next/server';
import { contentPipelineWorkflow } from '../../../../src/workflow/contentPipeline';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let topic: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.topic === 'string' && body.topic.trim().length > 0) {
      topic = body.topic.trim();
    }
  } catch {
    // no body or invalid JSON — use default topic
  }

  try {
    const result = await contentPipelineWorkflow({ topic });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
