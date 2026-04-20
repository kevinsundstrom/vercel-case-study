/**
 * Validates all fixture files against their zod schemas.
 * Run with: npm run validate-fixtures
 */
import {
  ClaimLedgerSchema,
  ComparisonSchemaSchema,
  VerificationReportSchema,
  LintReportSchema,
  PatchRequestSchema,
  PatchResponseSchema,
  SourcePlanSchema,
  EvidencePackSchema,
  ArticleDraftSchema,
  EditorialBriefSchema,
  SectionRenderingConfigSchema,
} from '../schemas';
import { claimLedgerFixture } from '../../fixtures/claimLedger.fixture';
import { comparisonSchemaFixture } from '../../fixtures/comparisonSchema.fixture';
import { verificationReportFixture } from '../../fixtures/verificationReport.fixture';
import { lintReportFixture } from '../../fixtures/lintReport.fixture';
import { patchRequestFixture } from '../../fixtures/patchRequest.fixture';
import { patchResponseFixture } from '../../fixtures/patchResponse.fixture';
import { sourcePlanFixture } from '../../fixtures/sourcePlan.fixture';
import { evidencePackVercelFixture } from '../../fixtures/evidencePack.vercel.fixture';
import { evidencePackCloudflareFixture } from '../../fixtures/evidencePack.cloudflare.fixture';
import { articleDraftFixture } from '../../fixtures/articleDraft.fixture';
import { editorialBrief } from '../config/editorialBrief';
import { sectionRenderingConfig } from '../config/sectionRendering';

type ValidationPair = {
  name: string;
  schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } };
  fixture: unknown;
};

const checks: ValidationPair[] = [
  { name: 'ClaimLedger', schema: ClaimLedgerSchema, fixture: claimLedgerFixture },
  { name: 'ComparisonSchema', schema: ComparisonSchemaSchema, fixture: comparisonSchemaFixture },
  { name: 'VerificationReport', schema: VerificationReportSchema, fixture: verificationReportFixture },
  { name: 'LintReport', schema: LintReportSchema, fixture: lintReportFixture },
  { name: 'PatchRequest', schema: PatchRequestSchema, fixture: patchRequestFixture },
  { name: 'PatchResponse', schema: PatchResponseSchema, fixture: patchResponseFixture },
  { name: 'SourcePlan', schema: SourcePlanSchema, fixture: sourcePlanFixture },
  { name: 'EvidencePack (vercel)', schema: EvidencePackSchema, fixture: evidencePackVercelFixture },
  { name: 'EvidencePack (cloudflare)', schema: EvidencePackSchema, fixture: evidencePackCloudflareFixture },
  { name: 'ArticleDraft', schema: ArticleDraftSchema, fixture: articleDraftFixture },
  { name: 'EditorialBrief (config)', schema: EditorialBriefSchema, fixture: editorialBrief },
  { name: 'SectionRenderingConfig (config)', schema: SectionRenderingConfigSchema, fixture: sectionRenderingConfig },
];

let allPassed = true;

for (const { name, schema, fixture } of checks) {
  const result = schema.safeParse(fixture);
  if (result.success) {
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ ${name}`, result.error);
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\nAll fixtures valid.');
}
