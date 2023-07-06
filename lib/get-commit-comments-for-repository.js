module.exports = getCommitCommentsForRepository;

/**
 * @param {{ octokit: import("octokit").Octokit}, owner: string, since: string} state
 * @param {string} repo
 * @returns
 */
async function getCommitCommentsForRepository({ octokit, owner, since }, repo) {
  const comments = await octokit.paginate(
    octokit.rest.repos.listCommitCommentsForRepo,
    { owner, repo }
  );

  return comments
    .filter((comment) => comment.created_at > since)
    .map((comment) => comment.url);
}
