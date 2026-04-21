import { NextRequest, NextResponse } from 'next/server';
import { refine, RefinementRequest, RefinementResult } from '../../../../src/agents/refine';
import { generateRunId } from '../../../../src/lib/ids';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json() as RefinementRequest;

  if (!body.draft || !body.feedback || !Array.isArray(body.feedback)) {
    return NextResponse.json(
      { error: 'Request must include draft string and feedback array' },
      { status: 400 }
    );
  }

  const runId = generateRunId();
  const result = await refine(body);
  const markdownDiff = formatDiff(result, runId);

  return NextResponse.json({ runId, result, markdownDiff });
}

function formatDiff(result: RefinementResult, runId: string): string {
  const lines: string[] = [
    `# Refinement diff — ${runId}`,
    ``,
    `Review each change below. Approve or reject before applying.`,
    ``,
  ];

  for (const diff of result.diffs) {
    lines.push(`## Change ${diff.id}`);
    lines.push(`**Target:** ${diff.target}`);
    lines.push(`**Reason:** ${diff.reason}`);
    lines.push(``);
    lines.push(`**Before:**`);
    lines.push(`\`\`\``);
    lines.push(diff.before);
    lines.push(`\`\`\``);
    lines.push(``);
    lines.push(`**After:**`);
    lines.push(`\`\`\``);
    lines.push(diff.after);
    lines.push(`\`\`\``);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  if (result.skipped.length > 0) {
    lines.push(`## Skipped feedback items`);
    lines.push(`The following items could not be addressed without touching untargeted text:`);
    result.skipped.forEach((id: string) => lines.push(`- ${id}`));
  }

  return lines.join('\n');
}
