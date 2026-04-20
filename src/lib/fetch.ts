import * as https from 'https';
import * as http from 'http';

export interface FetchResult {
  content: string;
  title: string;
  url: string;
  ok: boolean;
  error?: string;
}

export function fetchText(url: string, redirectCount = 0): Promise<FetchResult> {
  if (redirectCount > 3) {
    return Promise.resolve({ content: '', title: '', url, ok: false, error: 'Too many redirects' });
  }
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(
      url,
      { headers: { 'User-Agent': 'content-pipeline/0.1 (research; not for production)' } },
      (res) => {
        const location = res.headers.location;
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && location) {
          const next = location.startsWith('http') ? location : new URL(location, url).toString();
          fetchText(next, redirectCount + 1).then(resolve);
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf-8');
          const title = extractHTMLTitle(raw) ?? url;
          const content = stripHTML(raw);
          resolve({ content, title, url, ok: true });
        });
        res.on('error', (err: Error) => {
          resolve({ content: '', title: '', url, ok: false, error: err.message });
        });
      }
    );
    req.on('error', (err: Error) => {
      resolve({ content: '', title: '', url, ok: false, error: err.message });
    });
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ content: '', title: '', url, ok: false, error: 'Request timed out' });
    });
  });
}

function extractHTMLTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function stripHTML(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
