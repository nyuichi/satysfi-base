const shell = require('shelljs');
const request = require('request');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com'

const usage = () => {
    console.error(`Usage: node ${process.argv[1]} <last-release-tag>

Environment:
    GITHUB_TOKEN    Github API token`);
    process.exit(1);
}

if (process.argv.length !== 3 || !process.env.GITHUB_TOKEN) {
    usage();
}

const lastRelease = process.argv[2];
const githubToken = process.env.GITHUB_TOKEN;

const listPRsSince = (commit) => {
    return shell
        .exec(`git log --merges --first-parent master --pretty=format:"%s" ${commit}..`, { silent: true })
        .split(/\n/)
        .filter((line) => line !== "")   // makes [""] into []
        .map((msg) => msg.match(/Merge pull request #(\d+)/)[1]);
}

const requestPromise = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

const getPRDesc = async (pr) => {
    const body = await requestPromise({
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

console.log(`# Changelog since ${lastRelease}\n`);
Promise.all(listPRsSince(lastRelease).map(getPRDesc)).then((descs) => {
    for (const { number, title, author } of descs) {
        console.log(`- #${number} ${title} by ${author}`);
    }
});
