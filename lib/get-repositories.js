export default async function getRepositories({ octokit, owner }) {
  const repositories = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org: owner,
    per_page: 100,
  });
  return repositories.map((repository) => repository.name);
}
