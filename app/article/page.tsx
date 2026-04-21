import { readFileSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export const metadata = {
  title: 'Vercel vs Cloudflare Workflows: two mental models for AI agents',
};

async function getArticleHtml(): Promise<string> {
  const filePath = join(process.cwd(), 'drafts', 'run_60e780d58ab9-r3.md');
  const markdown = readFileSync(filePath, 'utf8');
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown);
  return result.toString();
}

export default async function ArticlePage() {
  const html = await getArticleHtml();

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-[680px]">
        <article
          className="prose prose-invert max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:text-[2rem] prose-h1:leading-tight prose-h1:mb-10
            prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4
            prose-p:text-[#a1a1a1] prose-p:leading-[1.75] prose-p:text-[15px]
            prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-a:decoration-[#444] hover:prose-a:decoration-white
            prose-strong:text-white
            prose-code:text-[#e1e1e1] prose-code:bg-[#111] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#1a1a1a] prose-pre:rounded-xl prose-pre:text-[13px]
            prose-hr:border-[#1a1a1a] prose-hr:my-10
            prose-li:text-[#a1a1a1] prose-li:text-[15px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
