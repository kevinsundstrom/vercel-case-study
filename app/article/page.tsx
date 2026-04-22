import { readFileSync } from 'fs';
import { join } from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

export const metadata = {
  title: 'Vercel Workflows vs Cloudflare Workflows: a new programming model vs a new primitive',
};

const TITLE = 'Vercel Workflows vs Cloudflare Workflows: a new programming model vs a new primitive';

async function getArticleHtml(): Promise<string> {
  const filePath = join(process.cwd(), 'drafts', 'run_60e780d58ab9-r7.md');
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
        className="fixed left-6 top-5 text-[13px] text-[#444] transition-colors hover:text-[#888]"
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
        <div className="mb-8 flex items-center justify-center text-[14px] font-medium text-[#ededed]">
          <span>Kevin Sundstrom</span>
        </div>

        {/* Meta row */}
        <div className="mb-2 flex items-center justify-between py-3 text-[13px] text-[#666]">
          <span>8 min read</span>
          <span>April 21, 2026</span>
        </div>

        {/* Lede */}
        <p
          style={{ fontFeatureSettings: '"liga"', fontSynthesisWeight: 'none', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }}
          className="mb-0 font-[family-name:var(--font-geist-sans)] text-[24px] font-medium leading-[36px] tracking-[-0.96px] text-[rgb(161,161,161)] py-6"
        >
          Production agents need durable execution. These two platforms put it in different places.
        </p>

        {/* Body */}
        <article
          style={{ fontFeatureSettings: '"liga"', fontSynthesisWeight: 'none' }}
          className="
            prose prose-invert max-w-none text-[18px]
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
