const shell = require('shelljs');
const utils = require('./utils.js');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com'

const usage = () => {
    console.error(`Usage: node ${process.argv[1]}

Environment:
    GITHUB_TOKEN    Github API token`);
    process.exit(1);
}

if (process.argv.length !== 2 || !process.env.GITHUB_TOKEN) {
    usage();
}

const githubToken = process.env.GITHUB_TOKEN;

const listPRsSince = (commit) => {
    return shell
        .exec(`git log --merges --first-parent master --pretty=format:"%s" ${commit}..`, { silent: true })
        .split(/\n/)
        .filter((line) => line !== "")   // makes [""] into []
        .map((msg) => msg.match(/Merge pull request #(\d+)/)[1]);
}

const getPRDesc = async (pr) => {
    const body = await utils.requestPromise({
        url: `${GITHUB_API_URL}/repos/nyuichi/satysfi-base/pulls/${pr}`,
        method: "GET",
        headers: {
            'Authorization': `token ${githubToken}`,
            'User-Agent': 'nyuichi'
        }
    });
    const json = JSON.parse(body);
    return {
        number: json.number,
        title: json.title,
        author: json.user.login
    };
}

const currentVersion = shell
    .cat('satysfi-base.opam')
    .grep('^version:')
    .match(/^version: "(.+)"/)[1];

console.log(`# Changelog since ${currentVersion}\n`);
Promise.all(listPRsSince(currentVersion).map(getPRDesc)).then((descs) => {
    for (const { number, title, author } of descs) {
        console.log(`- #${number} ${title} by ${author}`);
    }
});
