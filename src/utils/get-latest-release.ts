import { Octokit } from "octokit";

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_AUTH_KEY,
});

export async function getLatestRelease() {
	return octokit.rest.repos.getLatestRelease({
		owner: import.meta.env.VITE_GITHUB_OWNER,
		repo: import.meta.env.VITE_GITHUB_REPO,
	});
}
