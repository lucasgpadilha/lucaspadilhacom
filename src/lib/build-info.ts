import { execSync } from 'node:child_process';

export interface BuildInfo {
  sha: string;
  shortSha: string;
  builtAt: string;
  runUrl: string | null;
  repoUrl: string;
  commitUrl: string | null;
}

const git = (args: string) => {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};

let cached: BuildInfo | undefined;

/** Real metadata of the build that produced this page (GitHub Actions env first, then git). */
export function getBuildInfo(): BuildInfo {
  if (cached) return cached;
  const env = process.env;
  const sha = env.GITHUB_SHA || git('rev-parse HEAD') || 'local';
  const repoUrl = `${env.GITHUB_SERVER_URL || 'https://github.com'}/${env.GITHUB_REPOSITORY || 'lucasgpadilha/lucaspadilhacom'}`;
  cached = {
    sha,
    shortSha: sha === 'local' ? 'local' : sha.slice(0, 7),
    builtAt: new Date().toISOString(),
    runUrl: env.GITHUB_RUN_ID ? `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID}` : null,
    repoUrl,
    commitUrl: sha === 'local' ? null : `${repoUrl}/commit/${sha}`,
  };
  return cached;
}
