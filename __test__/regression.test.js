const shell = require("shelljs");
const { toMatchPdfSnapshot } = require("jest-pdf-snapshot");
expect.extend({ toMatchPdfSnapshot });

shell.config.fatal = true;

shell.cd("__test__");

afterAll(() => {
  shell.rm("-f", "test.pdf", "satysrc/**/*.satysfi-aux");
});

test("Confirm that satysfi is installed", () => {
  expect(shell.exec("satysfi -v").code).toBe(0);
});

test("Check compiler outputs", () => {
  const compilerOutput = shell
    .exec("satysfi satysrc/generic.saty", { silent: true })
    .exec(
      "awk '/evaluating texts .../{flag=1;next}/evaluation done/{flag=0}flag'",
      { silent: true }
    ).stdout;
  expect(compilerOutput).toMatchSnapshot();
});

test("SATySFi-iT", () => {
  const filePath = `satysrc/satysfi-it.saty`;
  const code = shell.exec(`satysfi ${filePath} -o test.pdf`, { silent: true })
    .code;

  expect(code).toBe(0);
  expect("test.pdf").toMatchPdfSnapshot();
});

describe("Derive", () => {
  const filenames = [
    "01-derive",
    "02-assume",
    "03-by",
    "04-by-and-byop",
    "05-from",
    "06-dotted-line",
    "07-customized-config",
  ];

  for (const filename of filenames) {
    test(`renders ${filename}`, () => {
      const filePath = `satysrc/derive/${filename}.saty -o test.pdf`;
      const code = shell.exec(`satysfi ${filePath}`, { silent: true }).code;

      expect(code).toBe(0);
      expect("test.pdf").toMatchPdfSnapshot();
    });
  }
});
