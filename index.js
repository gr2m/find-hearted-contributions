module.exports = findHeartedContributions;

const getLastUpdateTimestamp = require("./lib/get-last-update-timestamp");
const getRepositories = require("./lib/get-repositories");
const getIssuesAndPullRequestsForRepository = require("./lib/get-issues-and-pull-requests-for-repository");
const getCommentsForIssueOrPullRequestUrl = require("./lib/get-comments-for-issue-or-pull-request-url");
const getCommitCommentsForRepository = require("./lib/get-commit-comments-for-repository");
const getUrlIfHearted = require("./lib/get-url-if-hearted");

const Octokit = require("@octokit/rest").plugin([
  require("@octokit/plugin-throttling"),
  require("@octokit/plugin-retry"),
]);

async function findHeartedContributions(options) {
  const MyOctokit = options.cache
    ? Octokit.plugin(require("./lib/cache-plugin"))
    : Octokit;
  const octokit = new MyOctokit({
    auth: options.token,
    throttle: {
      onAbuseLimit: (error, options) => {
        octokit.log.error("onAbuseLimit", error, options);
      },
      onRateLimit: (error, options) => {
        octokit.log.error("onRateLimit", error, options);
      },
    },
  });

  octokit.hook.before("request", () => process.stdout.write("."));

  if (!/^https:\/\/github\.com\/.+$/.test(options.in)) {
    throw new TypeError(
      '"in" option must be a GitHub repo url (e.g. "https://github.com/octokit"',
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
        repositoryName,
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
