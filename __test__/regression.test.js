const fs = require("fs");
const shell = require("shelljs");
const tmp = require("tmp");
const { toMatchPdfSnapshot } = require("jest-pdf-snapshot");
expect.extend({ toMatchPdfSnapshot });

shell.config.fatal = true;

function compileSatysfi(src) {
  const tmpFile = tmp.fileSync();

  const { code: exitCode } = shell.exec(`satysfi ${src} -o ${tmpFile.name}`, {
    silent: true,
  });

  const pdfBuffer = fs.readFileSync(tmpFile.name);
  tmpFile.removeCallback();

  return {
    exitCode,
    pdfBuffer
  };
}

shell.cd("__test__");

afterAll(() => {
  shell.rm("-f", "test.pdf", "satysrc/**/*.satysfi-aux");
});

test("Confirm that satysfi is installed", () => {
  expect(shell.exec("satysfi --version").code).toBe(0);
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
  const result = compileSatysfi("satysrc/satysfi-it.saty");

  expect(result.exitCode).toBe(0);
  expect(result.pdfBuffer).toMatchPdfSnapshot();
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
      const result = compileSatysfi(`satysrc/derive/${filename}.saty`);

      expect(result.exitCode).toBe(0);
      expect(result.pdfBuffer).toMatchPdfSnapshot();
    });
  }
});
