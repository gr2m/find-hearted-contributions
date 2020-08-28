module.exports = getCommitCommentsForRepository;

async function getCommitCommentsForRepository({ octokit, owner, since }, repo) {
  const options = octokit.repos.listCommitComments.endpoint.merge({
    owner,
    repo,
  });
  const comments = await octokit.paginate(options);

  return comments
    .filter((comment) => comment.created_at > since)
    .map((comment) => comment.url);
}
