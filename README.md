# satysfi-lib

This repository contains a collection of utility functions and modules for SATySFi.
Because the library bundled with the default installation configuration of SATySFi is currently not rich enough, this project aims to provide a complementary library sufficient for most situations in typesetting.

Our repository contains:

- basic types and utilities (e.g. String, Char, etc)
- data structures (e.g. Array, etc)
- program controls (e.g. Error, Ref, etc)
- text processing (e.g. RegExp, Lexer, Parser, etc)
- extra typesetting functions (e.g. Inline, etc)

## Convention

As of this writing, we have not yet fixed a coding convention to be used throughout the library.
Each file may have different coding styles and interfaces.
We will refactor the whole library and make the interfaces consistent only after more functions are added.

Here we only list some pointers that can be useful for deciding your APIs:

- [The standard library of OCaml](https://caml.inria.fr/pub/docs/manual-ocaml/libref/index.html)
- [Jane Street's core library](https://opensource.janestreet.com/core/)
- [F# Core library Reference](https://msdn.microsoft.com/en-us/visualfsharpdocs/conceptual/fsharp-core-library-reference)

## Contribution

As of now, we still lack many many features.
Any pull requests and/or issues are welcome.
For the moment, we also give access rights to the repository to everyone who is willing to contribute us.
You can freely make changes, create branches, and push them.
If you are intersted in development of this project, please contact us.
