const shell = require('shelljs');
const gm = require('gm');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

shell.config.fatal = true

shell.cd('__test__');

const compileSatyToImg = (filename) => {
  expect(shell.exec(`satysfi ${filename}.saty`, {silent: true}).code).toBe(0);

  return new Promise((resolve, reject) => {
    gm(`${filename}.pdf`)
    .selectFrame(0)
    .toBuffer(`${filename}.png`, (err, buf) => {
      if (err) reject(err);

      resolve(buf);
    })
  })
}

afterAll(() => {
  shell.rm('-f', '**/*.pdf', '**/*.satysfi-aux');
})

test('Confirm that satysfi is installed', () => {
  expect(shell.exec('satysfi -v').code).toBe(0);
})

test('Check compiler outputs', () => {
  const compilerOutput = shell.exec('satysfi satysrc/generic.saty', {silent: true})
  .exec('awk \'/evaluating texts .../{flag=1;next}/evaluation done/{flag=0}flag\'', {silent: true})
  .stdout;
  expect(compilerOutput).toMatchSnapshot();
})

test('SATySFi-iT', async (done) => {
  const image = await compileSatyToImg(`satysrc/satysfi-it`);
  expect(image).toMatchImageSnapshot();
  done();
})
