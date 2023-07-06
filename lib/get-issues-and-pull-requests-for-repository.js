module.exports = getIssuesAndPullRequestsForRepository;

async function getIssuesAndPullRequestsForRepository(
  { octokit, owner, since },
  repo
) {
  const results = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    since: since,
    state: "all",
    per_page: 100,
  });

  return results.map((result) => {
    const isPullRequest = "pull_request" in result;
    if (isPullRequest) {
      return result.url.replace(/\/issues\//, "/pulls/");
    }

    return result.url;
  });
}
