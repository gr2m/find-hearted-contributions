import { Octokit } from "octokit";

import getLastUpdateTimestamp from "./lib/get-last-update-timestamp.js";
import getRepositories from "./lib/get-repositories.js";
import getIssuesAndPullRequestsForRepository from "./lib/get-issues-and-pull-requests-for-repository.js";
import getCommentsForIssueOrPullRequestUrl from "./lib/get-comments-for-issue-or-pull-request-url.js";
import getCommitCommentsForRepository from "./lib/get-commit-comments-for-repository.js";
import getUrlIfHearted from "./lib/get-url-if-hearted.js";
import cachePlugin from "./lib/cache-plugin.js";

export default async function findHeartedContributions(options) {
  const MyOctokit = options.cache ? Octokit.plugin(cachePlugin) : Octokit;
  const octokit = new MyOctokit({
    auth: options.token,
  });

  octokit.hook.before("request", () => process.stdout.write("."));

  if (!/^https:\/\/github\.com\/.+$/.test(options.in)) {
    throw new TypeError(
      '"in" option must be a GitHub repo url (e.g. "https://github.com/octokit"'
    );
  }

  const owner = options.in.substr("https://github.com/".length);

  const state = {
    octokit,
    owner,
    issuesAndPullRequestUrls: [],
    commentsUrls: [],
    comments: [],
    repoOnly: owner.split("/")[1],
    ...options,
  };

  try {
    state.since = await getLastUpdateTimestamp(state);
    if (state.repoOnly) {
      state.owner = state.owner.split("/")[0];
      state.repositories = [state.repoOnly];
    } else {
      state.repositories = await getRepositories(state);
    }

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

    for (const url of state.issuesAndPullRequestUrls) {
      const commentUrls = await getCommentsForIssueOrPullRequestUrl(state, url);
      state.commentsUrls.push(...commentUrls);
    }

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
  } catch (error) {
    octokit.log.error(error);
    return [];
  }
}
