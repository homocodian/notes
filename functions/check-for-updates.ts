import { Handler } from "@netlify/functions";
import { Octokit } from "octokit";
import { getResponseObject } from "../server/utils/get-response-object";

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_KEY,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return getResponseObject(405, "Method not allowed");
  }

  try {
    if (process.env.GITHUB_OWNER || process.env.GITHUB_REPO) {
      throw new Error("Something went wrong");
    }

    const data = await octokit.rest.repos.getLatestRelease({
      owner: process.env.VITE_GITHUB_OWNER,
      repo: process.env.VITE_GITHUB_REPO,
    });

    if (
      data.status === 200 &&
      data.data.target_commitish === "main" &&
      data.data.draft === false &&
      Number(data.data?.tag_name?.substring(1)?.split(".")?.join("")) >
        Number(process.env.RELEASE_NUMBER)
    ) {
      return getResponseObject(
        200,
        JSON.stringify({ url: data.data.body_html }),
        "application/json",
      );
    }

    return getResponseObject(404, "There are currently no updates available");
  } catch (error) {
    return getResponseObject(500, "Something went wrong");
  }
};
