# satysfi-base

[![build status](https://github.com/nyuichi/satysfi-base/workflows/CI/badge.svg)](https://github.com/nyuichi/satysfi-base/actions?query=workflow%3ACI)

## TL;DR

```ocaml
let get-image ratio path =
  path |> String.append `images/`
       |> Image.of-jpeg
       |> Inline.of-image (13.5cm |> Length.scale ratio)
in

ctx |> Inline.read {
  The quick brown fox jumps over the lazy dog.
  \eval(Inline.mandatory-break);
  \eval-const(`fox.jpg` |> get-image 0.45);
}
```

## What is satysfi-base

This repository contains a collection of utility functions and modules for SATySFi.
Because the library bundled with the default installation configuration of SATySFi is currently not rich enough, this project aims to provide a complementary library sufficient for most situations in typesetting.

Our repository contains:

- basic types and utilities (e.g. String, Char, etc)
- data structures (e.g. Array, Map, etc)
- program controls (e.g. Ref, Lazy, etc)
- text processing (e.g. RegExp, Lexer, Parser, etc)
- extra typesetting functions (e.g. Inline, Pager, etc)

We also provide some specific packages for typesetting:

- `code2`: display program sources with syntax highlight

## Installation

Easy installation using satyrographos:

```console
$ opam install satysfi-base
```

## Contribution

Any pull requests and/or issues are welcome.
For the moment, we also give access rights to the repository to everyone who is willing to contribute us.
You can freely make changes, create branches, and push them.
If you are intersted in development of this project, please contact us.

## License

All files in this repository are licensed under MIT.
Files under `zrbase` are originally written by Takayuki YATO.
