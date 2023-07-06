import { Octokit } from "octokit";

import getLastUpdateTimestamp from "./lib/get-last-update-timestamp.js";
import getRepositories from "./lib/get-repositories.js";
import getIssuesAndPullRequestsForRepository from "./lib/get-issues-and-pull-requests-for-repository.js";
import getCommentsForIssueOrPullRequestUrl from "./lib/get-comments-for-issue-or-pull-request-url.js";
import getCommitCommentsForRepository from "./lib/get-commit-comments-for-repository.js";
import getUrlIfHearted from "./lib/get-url-if-hearted.js";
import cachePlugin from "./lib/cache-plugin.js";

export default async function findHeartedContributions(options) {
  if (!/^https:\/\/github\.com\/.+$/.test(options.in)) {
    throw new TypeError(
      '"in" option must be a valid GitHub repo or organization url (e.g. "https://github.com/octokit" or "https://github.com/octokit/octokit.js")'
    );
  }

  const MyOctokit = options.cache ? Octokit.plugin(cachePlugin) : Octokit;
  const octokit = new MyOctokit({
    auth: options.token,
  });

  // log progress
  octokit.hook.before("request", () => {
    process.stdout.write(".");
  });

  const owner = options.in.substring("https://github.com/".length);

  const state = {
    octokit,
    owner,
    issuesAndPullRequestUrls: [],
    commentsUrls: [],
    comments: [],
    repoOnly: owner.split("/")[1],
    repositories: [],
    ...options,
  };

  // get since based on timestamp or last comment of passed URL
  state.since = await getLastUpdateTimestamp(state);

  // normalize --in option
  if (state.repoOnly) {
    state.owner = state.owner.split("/")[0];
    state.repositories = [state.repoOnly];
  } else {
    state.repositories = await getRepositories(state);
  }

  // gather all issues, pull requests, and commit comments
  for (const repositoryName of state.repositories) {
    const issuesAndPullRequestUrls =
      await getIssuesAndPullRequestsForRepository(state, repositoryName);
    state.issuesAndPullRequestUrls.push(...issuesAndPullRequestUrls);

    const commentUrls = await getCommitCommentsForRepository(
      state,
      repositoryName
    );
    state.commentsUrls.push(...commentUrls);
  }

  // get comments for issues and pull requests
  for (const url of state.issuesAndPullRequestUrls) {
    const commentUrls = await getCommentsForIssueOrPullRequestUrl(state, url);
    state.commentsUrls.push(...commentUrls);
  }

  // iterate through all issues, pull requests, and comments and check if they are hearted
  const heartedItems = [];
  for (const url of [
    ...state.issuesAndPullRequestUrls,
    ...state.commentsUrls,
  ]) {
    const heartedUrl = await getUrlIfHearted(state, url);
    if (heartedUrl) {
      heartedItems.push(heartedUrl);
    }
  }

  return heartedItems;
}
