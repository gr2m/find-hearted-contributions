module.exports = getLastUpdateTimestamp

async function getLastUpdateTimestamp ({ octokit, since }) {
  // if "since" option is a timestamp, return it
  if (/^\d/.test(since)) {
    return since
  }

  // otherwise set it to the created_at timestamp of the last comment of passed URL
  const [owner, repo, number] = since.match(/https:\/\/github.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/).slice(-3)

  // only retrieve commetns from past 60 days
  const date = new Date()
  date.setDate(date.getDate() - 60)

  const { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: number,
    per_page: 100,
    since: date.toISOString()
  })

  const [ lastComment ] = comments.slice(-1)
  return lastComment.created_at
}
