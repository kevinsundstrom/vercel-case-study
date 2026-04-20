import type { RunManifest, EvidencePack, SourcePlan } from '../types';
import { extractEvidenceFromSource } from '../agents/researcher';
import { fetchText } from '../lib/fetch';

export interface ExtractEvidenceInput {
  manifest: RunManifest;
  sourcePlan: SourcePlan;
}

export interface ExtractEvidenceOutput {
  manifest: RunManifest;
  /** One EvidencePack per vendor. */
  evidencePacks: EvidencePack[];
}

const MIN_CONTENT_LENGTH = 300;

/**
 * Fetches content from the planned source URLs and runs the researcher agent
 * to extract structured evidence for each vendor. Returns one EvidencePack per vendor.
 */
export async function extractEvidence(input: ExtractEvidenceInput): Promise<ExtractEvidenceOutput> {
  const manifest: RunManifest = {
    ...input.manifest,
    status: 'extracting',
    currentStage: 'extractEvidence',
    updatedAt: new Date().toISOString(),
  };

  const { vercel, cloudflare } = input.sourcePlan.vendorPlans;
  const evidencePacks: EvidencePack[] = [];

  for (const vendorPlan of [vercel, cloudflare]) {
    const sources = [];
    const extracts = [];

    for (const url of vendorPlan.candidateUrls) {
      process.stdout.write(`  [fetch:${vendorPlan.subject}] ${url} … `);
      const fetched = await fetchText(url);

      if (!fetched.ok) {
        console.log(`skip (${fetched.error})`);
        continue;
      }
      if (fetched.content.length < MIN_CONTENT_LENGTH) {
        console.log(`skip (content too short: ${fetched.content.length} chars)`);
        continue;
      }
      console.log(`ok (${fetched.content.length} chars)`);

      try {
        const result = await extractEvidenceFromSource(
          {
            vendor: vendorPlan.subject,
            sourceUrl: url,
            sourceTitle: fetched.title || url,
            content: fetched.content,
          },
          manifest.runId
        );
        sources.push(result.source);
        extracts.push(...result.extracts);
        console.log(`    → ${result.extracts.length} extracts`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`    extraction failed: ${msg}`);
      }
    }

    evidencePacks.push({
      runId: manifest.runId,
      vendor: vendorPlan.subject,
      sources,
      extracts,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    manifest: { ...manifest, updatedAt: new Date().toISOString() },
    evidencePacks,
  };
}
