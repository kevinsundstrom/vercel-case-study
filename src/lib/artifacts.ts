import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const RUNS_DIR = join(process.cwd(), 'runs');

export function saveArtifact(runId: string, name: string, data: unknown): string {
  const dir = join(RUNS_DIR, runId);
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${name}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return filePath;
}

export function loadArtifact<T>(runId: string, name: string): T {
  const filePath = join(RUNS_DIR, runId, `${name}.json`);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function saveMarkdownFile(runId: string, name: string, markdown: string): string {
  const dir = join(RUNS_DIR, runId);
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${name}.md`);
  writeFileSync(filePath, markdown, 'utf-8');
  return filePath;
}
