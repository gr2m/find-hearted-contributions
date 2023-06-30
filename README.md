# find-hearted-contributions

> Find contributions that you bookmarked by a heart emoji

## Usage

```
$ find-hearted-contributions [options]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --token    GitHub auth token                               [string]
  --in       GitHub organization URL                         [string] [required]
  --by       GitHub username                                 [string] [required]
  --since    timestamp in ISO 8601 format or GitHub issue URL, in which case
             since will be set to the created_at timestamp of the last comment
                                                             [string] [required]
  --cache    Cache responses for debugging            [boolean] [default: false]
```

## Example

```
$ npx find-hearted-contributions \
  --token 0123456789012345678901234567890123456789 \
  --in https://github.com/octokit \
  --by gr2m \
  --since 2019-05-01

...............................................................................................................................................................

done.

hearted items:
♥️ https://github.com/octokit/endpoint.js/issues/23#issuecomment-485986910
♥️ https://github.com/octokit/endpoint.js/issues/23#issuecomment-487742516
♥️ https://github.com/octokit/endpoint.js/pull/38
♥️ https://github.com/octokit/endpoint.js/pull/44
♥️ https://github.com/octokit/oauth-login-url.js/pull/5
♥️ https://github.com/octokit/oauth-login-url.js/pull/6
♥️ https://github.com/octokit/request.js/pull/45
♥️ https://github.com/octokit/request.js/pull/51
♥️ https://github.com/octokit/octokit.js/issues/1313#issuecomment-486644044
♥️ https://github.com/octokit/octokit.js/issues/1343
♥️ https://github.com/octokit/octokit.js/issues/1348#issuecomment-487853292
♥️ https://github.com/octokit/octokit.js/issues/1354#issuecomment-491195478
♥️ https://github.com/octokit/octokit.js/issues/1355
♥️ https://github.com/octokit/octokit.js/issues/1357
♥️ https://github.com/octokit/octokit.js/pull/1346
♥️ https://github.com/octokit/webhooks.js/issues/63#issuecomment-492793593
♥️ https://github.com/octokit/webhooks.js/issues/76
```

## Why?

As an Open Source project maintainer, I like to give shoutouts as part of a regular project update. For example, here is my updates issue for Octokit: [octokit/octokit.js#620)](https://github.com/octokit/octokit.js/issues/620). Here is a [comment containing a typical "Thanks" section](https://github.com/octokit/octokit.js/issues/620#issuecomment-484601114).

But not all contributions are worthy a shoutout. Not all worthy contributions are code. It was quite time consuming to go through all contributions since the last update and find the ones I’d like to give a shout out for. So I started to use the ❤️ reaction on issues, pull requests and comments as a way of boomarking the contributions for a later shoutout as I see them.

Digging out these hearted items turned out harder than I thought, so I wrote this CLI to help me with that from here on.

If you find it useful, please share where / how you use it 😊

## Usage

You must pass a GitHub personal authentication token. This project requires the "public_repo" scope for public repositories, "repo" scope for private repositories.

## Contributing

This is a very early version of something that I hope to become very useful for many maintainers out there. I’m open to any kind of contributions, be it ideas, code improvements, tests, or documentation.

Thanks!

## License

[ISC](LICENSE)
