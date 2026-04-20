import { put } from '@vercel/blob';

const RUNS_PREFIX = 'runs';

export async function saveArtifactToBlob(runId: string, name: string, data: unknown): Promise<string> {
  const blob = await put(
    `${RUNS_PREFIX}/${runId}/${name}.json`,
    JSON.stringify(data, null, 2),
    { access: 'private', contentType: 'application/json', addRandomSuffix: false }
  );
  return blob.url;
}

export async function saveMarkdownFileToBlob(runId: string, name: string, markdown: string): Promise<string> {
  const blob = await put(
    `${RUNS_PREFIX}/${runId}/${name}.md`,
    markdown,
    { access: 'private', contentType: 'text/markdown; charset=utf-8', addRandomSuffix: false }
  );
  return blob.url;
}
