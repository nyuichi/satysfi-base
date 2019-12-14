const shell = require('shelljs');
const gm = require('gm');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

shell.cd('__test__');

afterAll(() => {
  console.log(shell.pwd().toString());
  shell.rm('*.pdf', '*.satysfi-aux');
})

test('Confirm that satysfi is installed', () => {
  expect(shell.exec('satysfi -v').code).toBe(0);
})

test('Render StdJa', (done) => {
  render('stdja.test', (err, image) => {
    expect(err).toBeFalsy();
    expect(image).toMatchImageSnapshot();
    done();
  });
})

const render = (filename, callback) => {
  expect(shell.exec(`satysfi ${filename}.saty`).code).toBe(0);

  gm(`${filename}.pdf`)
  .selectFrame(0)
  .toBuffer(`${filename}.png`, callback);
}