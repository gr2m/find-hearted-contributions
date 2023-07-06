export default async function getCommitCommentsForRepository(
  { octokit, owner, since },
  repo
) {
  const comments = await octokit.paginate(
    octokit.rest.repos.listCommitCommentsForRepo,
    { owner, repo }
  );

  return comments
    .filter((comment) => comment.created_at > since)
    .map((comment) => comment.url);
}
