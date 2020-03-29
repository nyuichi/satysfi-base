const shell = require('shelljs');
const axios = require('axios');
require('dotenv').config();
shell.set('-e');

const usage = () => {
    console.error(`Usage: node ${process.argv[1]} <new-release>

Environment:
    GITHUB_TOKEN    Github API token`);
    process.exit(1);
}

if (process.argv.length !== 3 || !process.env.GITHUB_TOKEN) {
    usage();
}

const githubToken = process.env.GITHUB_TOKEN;
const newVersion = process.argv[2];

const githubApi = axios.create({
    baseURL: 'https://api.github.com/repos/nyuichi/satysfi-base',
    headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'nyuichi,'
    },
    responseType: 'json'
});

const currentBranch = shell
    .exec('git symbolic-ref --short HEAD')
    .trim();

if (currentBranch !== "master") {
    console.error("not in master branch");
    process.exit(1);
}

const releaseBranch = `release/${newVersion}`;

shell.exec(`git checkout -b ${releaseBranch} master`);
shell.sed('-i', /^version: "\d+.\d+.\d+"$/, `version: "${newVersion}"`, 'satysfi-base.opam');
shell.sed('-i', /^  \(version "\d+.\d+.\d+"\)/, `  (version "${newVersion}")`, 'Satyristes');
shell.exec('git add Satyristes satysfi-base.opam');
shell.exec(`git commit -m "release ${newVersion}"`);
shell.exec(`git push -u origin HEAD`);
shell.exec(`git checkout master`);

const changelog = shell.exec(`node scripts/make-changelog.js`);

const openPull = (branch, title, body) => {
    return githubApi.post('/pulls', {
        title,
        head: branch,
        body,
        base: "master"
    });
}

openPull(releaseBranch, `Release ${newVersion}`, changelog).catch(console.error);
