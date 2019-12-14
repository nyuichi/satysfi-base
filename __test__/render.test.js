const shell = require('shelljs');
const gm = require('gm');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

shell.cd('__test__');

const compareRenderOutputWithSnapshot = (filename) => {
  return (done) => {
    render(filename, (err, image) => {
      expect(err).toBeFalsy();
      expect(image).toMatchImageSnapshot();
      done();
    });
  }
}

afterAll(() => {
  console.log(shell.pwd().toString());
  shell.rm('**/*.pdf', '**/*.satysfi-aux');
})

test('Confirm that satysfi is installed', () => {
  expect(shell.exec('satysfi -v').code).toBe(0);
})

test('Render StdJa', compareRenderOutputWithSnapshot('src/stdja'))

describe('Render Derive', () => {
  it('derive', compareRenderOutputWithSnapshot('src/derive/derive'));
  it('assume', compareRenderOutputWithSnapshot('src/derive/assume'));
  it('by', compareRenderOutputWithSnapshot('src/derive/by'));
  it('by and byOp', compareRenderOutputWithSnapshot('src/derive/by-and-byop'));
  it('from', compareRenderOutputWithSnapshot('src/derive/from'));
  it('dotted line', compareRenderOutputWithSnapshot('src/derive/dotted-line'));
})

const render = (filename, callback) => {
  expect(shell.exec(`satysfi ${filename}.saty`, {silent: true}).code).toBe(0);

  gm(`${filename}.pdf`)
    .selectFrame(0)
    .toBuffer(`${filename}.png`, callback);
}