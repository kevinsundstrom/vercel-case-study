export function generateRunId(): string {
  return `run_${globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}
