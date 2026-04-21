const OWNER = 'kevinsundstrom';
const REPO = 'content-pipeline';
const BRANCH = 'main';

export async function commitDraftToRepo(runId: string, markdown: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');

  const path = `drafts/${runId}.md`;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `draft: add ${runId}`,
      content: Buffer.from(markdown).toString('base64'),
      branch: BRANCH,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${body}`);
  }

  const data = await response.json() as { content: { html_url: string } };
  return data.content.html_url;
}
