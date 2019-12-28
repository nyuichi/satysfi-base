const shell = require('shelljs');
const gm = require('gm');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

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
  shell.rm('**/*.pdf', '**/*.satysfi-aux');
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

describe('Derive', () => {
  const filenames = [
    '01-derive', 
    '02-assume',
    '03-by',
    '04-by-and-byop',
    '05-from', 
    '06-dotted-line'
  ];

  for (const filename of filenames) {
    test(`renders ${filename}`, async (done) => {
      const image = await compileSatyToImg(`satysrc/derive/${filename}`);
      expect(image).toMatchImageSnapshot();
      done();
    });
  }
})
