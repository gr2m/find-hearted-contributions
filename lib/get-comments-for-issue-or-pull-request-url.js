module.exports = getCommentsForIssueOrPullRequestUrl;

async function getCommentsForIssueOrPullRequestUrl({ octokit, since }, url) {
  const comments = await octokit.paginate({
    url: `${url}/comments`,
    since: since,
    per_page: 100,
  });

  // for pull requests, also get review comments
  if (/\/pulls\//.test(url)) {
    const reviews = await octokit.paginate({
      url: `${url}/reviews`,
      per_page: 100,
    });

    for (const { id } of reviews) {
      const reviewComments = await octokit.paginate({
        url: `${url}/reviews/${id}/comments`,
        per_page: 100,
      });

      comments.push(
        ...reviewComments.filter((comment) => comment.created_at > since),
      );
    }
  }

  return comments.map((result) => result.url);
}
