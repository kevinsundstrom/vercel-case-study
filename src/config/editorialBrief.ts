import type { EditorialBrief } from '../types';

export const editorialBrief: EditorialBrief = {
  audience: {
    role: 'platform engineers evaluating orchestration models',
    context: 'choosing between workflow systems for backend processes',
    priorKnowledge: 'familiar with serverless and async workflows',
  },
  objective:
    'help the reader understand how the programming model differs and when each approach is a better fit',
  coreThesis:
    'Vercel Workflows treats orchestration as application code, while Cloudflare Workflows treats it as a managed execution graph.',
  keyTensions: [
    'control vs abstraction',
    'debuggability vs simplicity',
    'code-native vs platform-native workflows',
  ],
  readerTakeaway:
    'the right choice depends on whether you want orchestration embedded in your codebase or managed as a separate workflow system',
  tone: {
    style: 'technical',
    verbosity: 'tight',
  },
  constraints: {
    mustBeComparative: true,
    noGenericHeadings: true,
    noFluff: true,
  },
};
