const shell = require("shelljs");
const axios = require("axios");
require("dotenv").config();
shell.set("-e");

const usage = () => {
  console.error(`Usage: node ${process.argv[1]}

Environment:
    GITHUB_TOKEN    Github API token`);
  process.exit(1);
};

if (process.argv.length !== 2 || !process.env.GITHUB_TOKEN) {
  usage();
}

const githubToken = process.env.GITHUB_TOKEN;

const githubApi = axios.create({
  baseURL: "https://api.github.com/repos/nyuichi/satysfi-base",
  headers: {
    Authorization: `token ${githubToken}`,
    "User-Agent": "nyuichi,",
  },
  responseType: "json",
});

const listPulls = (since) => {
  return shell
    .exec(
      `git log --merges --first-parent master --pretty=format:"%s" ${since}..`,
      { silent: true }
    )
    .split(/\n/)
    .filter((line) => line !== "") // makes [""] into []
    .map((msg) => msg.match(/Merge pull request #(\d+)/)[1]);
};

const getPull = async (pr) => {
  const data = (await githubApi.get(`/pulls/${pr}`)).data;
  return {
    number: data.number,
    title: data.title,
    author: data.user.login,
  };
};

const currentVersion = shell
  .cat("satysfi-base.opam")
  .grep("^version:")
  .match(/^version: "(.+)"/)[1];

console.log(`# Changelog since ${currentVersion}\n`);
Promise.all(listPulls(currentVersion).map(getPull))
  .then((descs) => {
    for (const { number, title, author } of descs) {
      console.log(`- #${number} ${title} by ${author}`);
    }
  })
  .catch(console.error);
