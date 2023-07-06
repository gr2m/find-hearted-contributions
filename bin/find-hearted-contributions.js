#!/usr/bin/env node

import yargs from "yargs";

import findHeartedContributions from "../index.js";

var argv = yargs
  .usage("Usage: $0 [options]")
  .example(
    "$0 --token 0123456789012345678901234567890123456789 --in https://github.com/octokit --by gr2m --since 2019-05-01"
  )

  .option("token", {
    description:
      'Requires the "public_repo" scope for public repositories, "repo" scope for private repositories.',
    demandOption: true,
    type: "string",
  })
  .option("in", {
    description: "GitHub organization URL, or the repository url",
    demandOption: true,
    type: "string",
  })
  .option("by", {
    description: "GitHub username (or comma-separated list of usernames",
    demandOption: true,
    type: "string",
  })
  .option("since", {
    description:
      "timestamp in ISO 8601 format or GitHub issue URL, in which case since will be set to the created_at timestamp of the last comment",
    demandOption: true,
    type: "string",
  })
  .option("cache", {
    description: "Cache responses for debugging",
    type: "boolean",
    default: false,
  })
  .epilog("copyright 2019").argv;

const heartedItems = await findHeartedContributions(argv);

console.log("\n\ndone.\n");

if (heartedItems.length === 0) {
  console.log("No hearted items.");
}

console.log("hearted items:");

for (const url of heartedItems.sort()) {
  console.log(`♥️ ${url}`);
}
