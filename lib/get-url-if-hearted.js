export default async function getUrlIfHearted({ octokit, by }, url) {
  if (/\/pulls\/\d+$/.test(url)) {
    url = url.replace(/\/pulls\//, "/issues/");
  }

  const reactions = await octokit.paginate({
    url: `${url}/reactions`,
    content: "heart",
    per_page: 100,
  });

  const isHearted = reactions.find((reaction) => reaction.user.login === by);

  if (!isHearted) {
    return false;
  }

  const {
    data: { html_url: itemUrl },
  } = await octokit.request(url);
  return itemUrl;
}
