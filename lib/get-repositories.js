module.exports = getRepositories;

async function getRepositories({ octokit, owner }) {
  const options = octokit.repos.listForOrg.endpoint.merge({
    org: owner,
    per_page: 100,
  });

  const repositories = await octokit.paginate(options);
  return repositories.map((repository) => repository.name);
}
