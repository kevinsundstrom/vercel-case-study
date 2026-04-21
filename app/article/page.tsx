import { readFileSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export const metadata = {
  title: 'Vercel Workflows vs Cloudflare Workflows: two mental models for AI agents',
};

async function getArticleHtml(): Promise<{ title: string; html: string }> {
  const filePath = join(process.cwd(), 'drafts', 'run_60e780d58ab9-r4.md');
  const raw = readFileSync(filePath, 'utf8');

  // Strip the h1 from the markdown — we render it separately
  const withoutTitle = raw.replace(/^#\s+.+\n/, '');

  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(withoutTitle);

  return {
    title: 'Vercel Workflows vs Cloudflare Workflows: two mental models for AI agents',
    html: result.toString(),
  };
}

export default async function ArticlePage() {
  const { title, html } = await getArticleHtml();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="mx-auto max-w-[680px] px-6 pb-32 pt-20">
        {/* Byline */}
        <div className="mb-8 flex items-center gap-2 text-[13px] text-[#666]">
          <span>Kevin Sundstrom</span>
          <span>·</span>
          <span>April 21, 2026</span>
          <span>·</span>
          <span>8 min read</span>
        </div>

        {/* Title */}
        <h1 className="mb-10 font-[family-name:var(--font-geist-sans)] text-[2.5rem] font-bold leading-[1.15] tracking-[-0.03em] text-white">
          {title}
        </h1>

        {/* Body */}
        <article
          className="
            prose prose-invert max-w-none
            [&_p]:text-[#ededed] [&_p]:text-[16px] [&_p]:leading-[1.8]
            [&_h2]:text-white [&_h2]:text-[1.1rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:mt-12 [&_h2]:mb-3
            [&_h3]:text-white [&_h3]:text-[0.95rem] [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2
            [&_a]:text-[oklch(0.717_0.1648_250.794)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-[oklch(0.717_0.1648_250.794)] [&_a:hover]:opacity-80 [&_a]:transition-opacity
            [&_strong]:text-white [&_strong]:font-semibold
            [&_code]:font-[family-name:var(--font-geist-mono)] [&_code]:text-[#e1e1e1] [&_code]:bg-[#161616] [&_code]:px-[5px] [&_code]:py-[2px] [&_code]:rounded [&_code]:text-[13px] [&_code]:before:content-none [&_code]:after:content-none
            [&_pre]:bg-[#111] [&_pre]:border [&_pre]:border-[#222] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#e1e1e1] [&_pre_code]:text-[13px] [&_pre_code]:leading-[1.7]
            [&_hr]:border-[#1a1a1a] [&_hr]:my-10
            [&_li]:text-[#ededed] [&_li]:text-[16px] [&_li]:leading-[1.8]
            [&_blockquote]:border-l-[#333] [&_blockquote]:text-[#999]
            [&_table]:text-[14px] [&_th]:text-white [&_th]:font-semibold [&_td]:text-[#ededed] [&_th]:border-[#222] [&_td]:border-[#1a1a1a]
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>

  );
}
