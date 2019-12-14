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

const render = (filename, callback) => {
  expect(shell.exec(`satysfi ${filename}.saty`, {silent: true}).code).toBe(0);

  gm(`${filename}.pdf`)
    .selectFrame(0)
    .toBuffer(`${filename}.png`, callback);
}

afterAll(() => {
  console.log(shell.pwd().toString());
  shell.rm('**/*.pdf', '**/*.satysfi-aux');
})

test('Confirm that satysfi is installed', () => {
  expect(shell.exec('satysfi -v').code).toBe(0);
})

describe('Derive', () => {
  test('renders derive', compareRenderOutputWithSnapshot('src/derive/derive'));
  test('renders assume', compareRenderOutputWithSnapshot('src/derive/assume'));
  test('renders by', compareRenderOutputWithSnapshot('src/derive/by'));
  test('renders by and byOp', compareRenderOutputWithSnapshot('src/derive/by-and-byop'));
  test('renders from', compareRenderOutputWithSnapshot('src/derive/from'));
  test('renders dotted line', compareRenderOutputWithSnapshot('src/derive/dotted-line'));
})