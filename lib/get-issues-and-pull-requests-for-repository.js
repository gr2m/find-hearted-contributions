module.exports = getIssuesAndPullRequestsForRepository;

async function getIssuesAndPullRequestsForRepository(
  { octokit, owner, since },
  repo
) {
  const options = octokit.issues.listForRepo.endpoint.merge({
    owner,
    repo,
    since: since,
    state: "all",
    per_page: 100,
  });

  const results = await octokit.paginate(options);

  return results.map((result) => {
    const isPullRequest = "pull_request" in result;
    if (isPullRequest) {
      return result.url.replace(/\/issues\//, "/pulls/");
    }

    return result.url;
  });
}
