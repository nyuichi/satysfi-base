# Notes on regression tests
## How to run them
You need to install [SATySFi](https://github.com/gfngfn/SATySFi), [Yarn](https://yarnpkg.com/lang/en/docs/install), and [GraphicsMagick](http://www.graphicsmagick.org).

```shell
$ yarn install  # install dependencies
$ yarn test     # run test
```

## How to keep them updated
The existing tests stores current expected output as *snapshots* in `__snapshots__` (for compiler outputs) or `__image_snapshots__` (for pdf output). 

* If you changed compiler output, you would see diffs in test result.
* If you changed typesetting libs and pdf output was different from snapshots, diffs between new output and snapshots would be put into `__tests__/__image_snapshots__/__diff_output__`.

Check them out and see if they are acceptable. If you think they are okay, you can just run `yarn test --updateSnapshot` to update snapshots.
