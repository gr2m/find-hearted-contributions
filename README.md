# find-hearted-contributions

> Find contributions that you bookmarked my adding a heart emoji

## Usage

```
$ find-hearted-contributions.js [options]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --in       GitHub organization URL                         [string] [required]
  --by       GitHub username                                 [string] [required]
  --since    timestamp in ISO 8601 format or GitHub issue URL, in which case
             since will be set to the created_at timestamp of the last comment
                                                             [string] [required]
  --cache    Cache responses for debugging            [boolean] [default: false]
```

## Example

```
$ npx find-hearted-contributions.js \
  --token 0123456789012345678901234567890123456789 \
  --in https://github.com/octokit \
  --by gr2m --since 2019-05-01

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
♥️ https://github.com/octokit/rest.js/issues/1313#issuecomment-486644044
♥️ https://github.com/octokit/rest.js/issues/1343
♥️ https://github.com/octokit/rest.js/issues/1348#issuecomment-487853292
♥️ https://github.com/octokit/rest.js/issues/1354#issuecomment-491195478
♥️ https://github.com/octokit/rest.js/issues/1355
♥️ https://github.com/octokit/rest.js/issues/1357
♥️ https://github.com/octokit/rest.js/pull/1346
♥️ https://github.com/octokit/webhooks.js/issues/63#issuecomment-492793593
♥️ https://github.com/octokit/webhooks.js/issues/76
```

## Contributing

This is a very early version of something that I hope to become very useful for many maintainers out there. I’m open to any kind of contributions, be it ideas, code improvemetns, tests, or documentation.

Thanks!

## License

[ISC](LICENSE)
