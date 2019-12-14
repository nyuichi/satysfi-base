const shell = require('shelljs');

test('Confirm that satysfi is installed', () => {
  expect(shell.exec('satysfi -v').code).toBe(0);
})
