import { readFileSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export const metadata = {
  title: 'Vercel vs Cloudflare Workflows: two mental models for AI agents',
};

async function getArticleHtml(): Promise<{ title: string; html: string }> {
  const filePath = join(process.cwd(), 'drafts', 'run_60e780d58ab9-r3.md');
  const raw = readFileSync(filePath, 'utf8');

  // Strip the h1 from the markdown — we render it separately
  const withoutTitle = raw.replace(/^#\s+.+\n/, '');

  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(withoutTitle);

  return {
    title: 'Vercel vs Cloudflare Workflows: two mental models for AI agents',
    html: result.toString(),
  };
}

export default async function ArticlePage() {
  const { title, html } = await getArticleHtml();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <svg height="20" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vercel">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
          </svg>
          <span className="ml-4 text-sm text-[#666]">Blog</span>
        </div>
      </nav>

      <main className="mx-auto max-w-[680px] px-6 pb-32 pt-16">
        {/* Byline */}
        <div className="mb-8 flex items-center gap-2 text-[13px] text-[#666]">
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
            [&_p]:text-[#888] [&_p]:text-[16px] [&_p]:leading-[1.8]
            [&_h2]:text-white [&_h2]:text-[1.1rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:mt-12 [&_h2]:mb-3
            [&_h3]:text-white [&_h3]:text-[0.95rem] [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2
            [&_a]:text-white [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-[#444] [&_a:hover]:decoration-white [&_a]:transition-colors
            [&_strong]:text-white [&_strong]:font-semibold
            [&_code]:font-[family-name:var(--font-geist-mono)] [&_code]:text-[#e1e1e1] [&_code]:bg-[#161616] [&_code]:px-[5px] [&_code]:py-[2px] [&_code]:rounded [&_code]:text-[13px] [&_code]:before:content-none [&_code]:after:content-none
            [&_pre]:bg-[#111] [&_pre]:border [&_pre]:border-[#222] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#e1e1e1] [&_pre_code]:text-[13px] [&_pre_code]:leading-[1.7]
            [&_hr]:border-[#1a1a1a] [&_hr]:my-10
            [&_li]:text-[#888] [&_li]:text-[16px] [&_li]:leading-[1.8]
            [&_blockquote]:border-l-[#333] [&_blockquote]:text-[#666]
            [&_table]:text-[14px] [&_th]:text-white [&_th]:font-semibold [&_td]:text-[#888] [&_th]:border-[#222] [&_td]:border-[#1a1a1a]
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
}
