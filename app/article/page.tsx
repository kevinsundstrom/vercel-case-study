import { readFileSync } from 'fs';
import { join } from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

export const metadata = {
  title: 'The architecture of resilient agents',
};

const TITLE = 'The architecture of resilient agents';

async function getArticleHtml(): Promise<string> {
  const filePath = join(process.cwd(), 'drafts', 'run_60e780d58ab9-r11.md');
  const raw = readFileSync(filePath, 'utf8');
  const withoutTitle = raw.replace(/^#\s+.+\n/, '');

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(withoutTitle);

  return result.toString();
}

export default async function ArticlePage() {
  const html = await getArticleHtml();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <a
        href="https://github.com/kevinsundstrom/vercel-case-study"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 top-5 hidden text-[13px] text-[#444] transition-colors hover:text-[#888] md:block"
      >
        Repository
      </a>

      <style>{`
        /* Prism token colors matched from Vercel blog */
        .token.keyword,
        .token.operator { color: oklch(0.6936 0.2223 3.91); }

        .token.function,
        .token.function-variable,
        .token.class-name { color: oklch(0.6987 0.2037 309.51); }

        .token.string,
        .token.template-string,
        .token.template-punctuation.string,
        .token.inserted { color: oklch(0.731 0.2158 148.29); }

        .token.comment { color: rgb(139, 139, 139); }

        .token.number,
        .token.boolean { color: oklch(0.7 0.15 50); }

        .token.punctuation,
        .token.plain-text { color: rgb(237, 237, 237); }
      `}</style>

      <main className="mx-auto max-w-[720px] px-6 pb-32 pt-14">
        {/* Title */}
        <h1 className="mb-4 text-center font-[family-name:var(--font-geist-sans)] text-[2.5rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#ededed]">
          {TITLE}
        </h1>

        {/* Author */}
        <div className="mb-8 flex items-center justify-center gap-2 text-[14px] font-medium text-[#ededed]">
          <span>Kevin Sundstrom</span>
          <span className="font-normal text-[#666]">Content Engineer</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between py-3 text-[13px] text-[rgb(161,161,161)]">
          <span className="flex items-center gap-2">
            <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" aria-hidden="true" style={{ color: 'rgb(161,161,161)' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M5.35066 2.06247C5.96369 1.78847 6.62701 1.60666 7.32351 1.53473L7.16943 0.0426636C6.31208 0.1312 5.49436 0.355227 4.73858 0.693033L5.35066 2.06247ZM8.67651 1.53473C11.9481 1.87258 14.5 4.63876 14.5 8.00001C14.5 11.5899 11.5899 14.5 8.00001 14.5C4.63901 14.5 1.87298 11.9485 1.5348 8.67722L0.0427551 8.83147C0.459163 12.8594 3.86234 16 8.00001 16C12.4183 16 16 12.4183 16 8.00001C16 3.86204 12.8589 0.458666 8.83059 0.0426636L8.67651 1.53473ZM2.73972 4.18084C3.14144 3.62861 3.62803 3.14195 4.18021 2.74018L3.29768 1.52727C2.61875 2.02128 2.02064 2.61945 1.52671 3.29845L2.73972 4.18084ZM1.5348 7.32279C1.60678 6.62656 1.78856 5.96348 2.06247 5.35066L0.693033 4.73858C0.355343 5.4941 0.131354 6.31152 0.0427551 7.16854L1.5348 7.32279ZM8.75001 4.75V4H7.25001V4.75V7.875C7.25001 8.18976 7.3982 8.48615 7.65001 8.675L9.55001 10.1L10.15 10.55L11.05 9.35L10.45 8.9L8.75001 7.625V4.75Z" fill="currentColor" />
            </svg>
            8 min read
          </span>
          <span>April 21, 2026</span>
        </div>

        {/* Lede */}
        <p
          style={{ fontFeatureSettings: '"liga"', fontSynthesisWeight: 'none', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }}
          className="mb-0 font-[family-name:var(--font-geist-sans)] text-[24px] font-medium leading-[36px] tracking-[-0.96px] text-[rgb(161,161,161)] py-6"
        >
          Building for the real world where LLM calls fail and workflows hang. A comparison of how Vercel and Cloudflare approach agent durability.
        </p>

        {/* Body */}
        <article
          style={{ fontFeatureSettings: '"liga"', fontSynthesisWeight: 'none' }}
          className="
            mt-6 prose prose-invert max-w-none text-[18px]
            [&_p]:text-[#ededed] [&_p]:text-[18px] [&_p]:leading-[28px] [&_p]:mt-0
            [&_h2]:text-[#ededed] [&_h2]:text-[24px] [&_h2]:font-semibold [&_h2]:tracking-[-0.96px] [&_h2]:leading-[32px] [&_h2]:mt-12 [&_h2]:mb-4
            [&_h3]:text-[#ededed] [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:tracking-[-0.6px] [&_h3]:leading-[28px] [&_h3]:mt-8 [&_h3]:mb-3
            [&_a]:text-[oklch(0.717_0.1648_250.794)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-[oklch(0.717_0.1648_250.794)] [&_a:hover]:opacity-80 [&_a]:transition-opacity
            [&_strong]:text-[#ededed] [&_strong]:font-semibold
            [&_code]:font-[family-name:var(--font-geist-mono)] [&_code]:text-[#ededed] [&_code]:bg-[#161616] [&_code]:px-[5px] [&_code]:py-[2px] [&_code]:rounded [&_code]:text-[13px] [&_code]:before:content-none [&_code]:after:content-none
            [&_pre]:bg-[#111] [&_pre]:border [&_pre]:border-[#222] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#ededed] [&_pre_code]:text-[13px] [&_pre_code]:leading-[20px] [&_pre_code]:font-variant-ligatures-none
            [&_hr]:hidden
            [&_li]:text-[#ededed] [&_li]:text-[18px] [&_li]:leading-[28px]
            [&_blockquote]:border-l-[#333] [&_blockquote]:text-[#999]
            [&_table]:text-[14px] [&_th]:text-[#ededed] [&_th]:font-semibold [&_td]:text-[#ededed] [&_th]:border-[#222] [&_td]:border-[#1a1a1a]
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-16">
          <div className="border-t border-[#1a1a1a] pt-10 text-center">
            <p className="mb-4 text-[15px] text-[#666]">
              This article was produced by a claim-governed content pipeline built on Vercel Workflows.
            </p>
            <a
              href="https://github.com/kevinsundstrom/vercel-case-study"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[14px] text-[oklch(0.717_0.1648_250.794)] underline underline-offset-[3px] decoration-[oklch(0.717_0.1648_250.794)] transition-opacity hover:opacity-80"
            >
              View the repository →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
