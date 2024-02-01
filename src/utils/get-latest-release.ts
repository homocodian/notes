import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_AUTH_KEY,
});

export async function getLatestRelease() {
  if (!import.meta.env.VITE_GITHUB_OWNER || !import.meta.env.VITE_GITHUB_REPO) {
    return undefined;
  }

  return octokit.rest.repos.getLatestRelease({
    owner: import.meta.env.VITE_GITHUB_OWNER,
    repo: import.meta.env.VITE_GITHUB_REPO,
  });
}

export async function checkForUpdates() {
  const data = await getLatestRelease();

  if (!data) {
    return null;
  }

  if (
    data.status === 200 &&
    data.data.target_commitish === "main" &&
    data.data.draft === false &&
    Number(data.data?.tag_name?.substring(1)?.split(".")?.join("")) >
      Number(import.meta.env.VITE_RELEASE_NUMBER)
  ) {
    return data;
  }
  return null;
}
