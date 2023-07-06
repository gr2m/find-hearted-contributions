import { URL } from "node:url";
import { dirname } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

export default function cachePlugin(octokit) {
  octokit.hook.wrap("request", async (request, options) => {
    if (options.method !== "GET") {
      return request(options);
    }

    const { url } = octokit.request.endpoint.parse(options);

    const { pathname, searchParams } = new URL(url);
    const page = searchParams.get("page");
    const cachePath = `./cache${pathname}${page ? `-page-${page}` : ""}.json`;

    try {
      return JSON.parse(await readFile(cachePath, "uft8"));
    } catch (error) {
      const response = await request(options);

      await mkdir(dirname(cachePath), { recursive: true });
      await writeFile(cachePath, JSON.stringify(response, null, 2) + "\n");
      return response;
    }
  });
}
