satysfi-zrbase
==============

SATySFiでのプログラミングをもっと快適にするためのパッケージ集

原則的に組版と無関係な機能を提供する。

## 例

```text
@require: zmtdoc0
@require: zrbase0
@require: zrandom0
@require: list

% log messages with formatting
let (snowman, eight) = (9731, 56)
let () = z-infof (fun f -> % it's '%04X' form
  [`snowman = U+`; f#zw 4 f#ux snowman; `; eight = U+`; f#zw 4 f#ux eight])

% do some math
let sqrt2 = sqrt 2.
let () = z-infof (fun f -> [`sqrt 2 = `#;f#g sqrt2])
let logval = log 123456789.
let () = z-infof (fun f -> [`log 123456789 = `#;f#g logval])

% random numbers
let () = ZRandom0.init 129414 % seed
let rolls = List.map (fun k -> ZRandom0.int k + 1) [6;6;6;6;6;20;20;20]
let () = z-infof (fun f -> [`dice rolls: `#;f#bls f#d rolls])

in
% The PDF output is empty :-)
document ()
```

これを普通にコンパイルすると、**端末に**以下のように表示される。

```text
  [INFO] snowman = U+2603; eight = U+0038
  [INFO] sqrt 2 = 1.41421356237
  [INFO] log 123456789 = 18.6314017662
  [INFO] dice rolls: [2;4;5;3;5;13;7;14]
```

## 概要

詳細については、各パッケージファイルの冒頭（モジュール定義以前、または、シグネチャ部）のコメントを参照されたい。

  * zrbase0： 基本機能
      - 他のパッケージを色々読み込んで、その一部を**グローバルに配置する**。
      - 以下のパッケージを読み込む：  
        zp0 zl0 zfmt0 zexn0 zlist0 zlog0 znum0 zresult0 zs0
      - ZP0、ZL0の大部分の関数と以下の関数（一部は`z-`の接頭辞付）を“open”する。  
          - ZNum0から：fnear
          - ZFmt0から：z-format
          - ZLog0から：z-debug、z-info、z-warn、z-error
      - 書式付のログ出力命令：
          - z-debugf、z-infof、z-warnf、z-errorf
          - z-debugl、z-infol、z-warnl、z-errorl
  * zexn0： 例外モドキ
      - 要するに故意に実行時エラーを起こしてプログラムを終了させる。
      - ZExn0 モジュール
          - 型 t
          - make、stop、raise
  * zp0： 一般機能
      - OCamlのPervasivesの機能の一部を移植した。
      - ZP0 モジュール
          - invalid-arg、failwith、
            min、max、succ、pred、abs、max-int、min-int、
            pow、sqrt、exp、log、log10、ceil、floor、abs-float、mod-float、frexp、ldexp、float-of-int、truncate、max-float、min-float、epsilon-float、fneg、fmin、fmax、
            ignore、
            string-of-bool、bool-of-string、bool-of-string-opt、string-of-int、int-of-string、int-of-string-opt、string-of-float、
            fst、snd、
            incr、decr
  * zl0： 長さ値
      - ZL0 モジュール
          - lneg、lequal、lmin、lmax、string-of-length
  * zfmt0： 書式付文字列化
      - 要するにsprintf的なやつ。
        だけど普通に静的型の範囲での実装となるのでかなり苦しい。
      - ZFmt0 モジュール
          - verbs、format-using、format
  * zlog0： ログ出力
      - 端末にメッセージを出力する。
      - errorは、エラーレベルログを出すとともに例外モドキを起こす。
      - ZLog0 モジュール
          - set-verbosity、set-logger、
            log、debug、info、warn、errorlog、
            error
  * znum0： 数値
      - intとfloatに関する機能で、ZP0にある以外のもの。
      - ZNum0 モジュール
          - pi、deg、powi、fpowi、fnear、
            string-of-int-radix、string-of-int-radix-u
  * zresult0： 失敗しうる操作の結果
      - OCamlのResultモジュールみたいなやつ。
      - **グローバル定義**
          - 'a result 型： Ok、Error
      - ZResult0 モジュール
          - to-option、of-option、force
  * zrandom0： 擬似乱数
      - ACORNアルゴリズムによる擬似乱数生成器。
      - ZRandom0 モジュール
          - init、bits、int、float、bool、
            create、bits-with、int-with、float-with、bool-with
  * zmtdoc0： ダミー用の空の文書
      - 専らログ出力を使うテスト文書を作る際にも何かdocument値を返す必要がある。このパッケージを読み込むと`document()`でdocument値が得られる。
      - **グローバル定義**
          - empty-document、document
  * zlist0： リスト
      - 標準のlistパッケージにないやつ。
      - ZList0 モジュール
          - (TBD)
  * zs0： 文字列
      - ZS0 モジュール
          - (TBD)

## ライセンス

MITライセンスの下で配布される。

--------------------

## 開発用メモ

  - SATySFiの次のリリースが出る時を目途にして、zmtdoc0 以外のパッケージを汎用（`.satyg`）にしたい。
      - 使用している函数の一部が0.0.3版ではテキストモード非対応である。（HEAD版では大丈夫。）
  - パッケージ名・モジュール名の後ろの数字（`0`）は「メジャーバージョン番号」。
      - 後方互換性を損なうような仕様変更が入ると数字が増える。
      - 「メジャーバージョン」が異なるものは異なるパッケージ・モジュールなので共存できる。ただし、グローバルに定義を行うもの（zbase0・zresult0・zmtdoc0）は例外。

### パッケージ間の依存関係

各パッケージは、自分より指数が低いパッケージへの依存をもちうる。

    1 : zexn0
    2 : zresult0
    3 : zl0, zlist0, znum0, zp0, zs0
    4 : zfmt0, zlog0, zrandom0
    9 : zmtdoc0, zrbase0

--------------------
Takayuki YATO (aka. "ZR")  
https://github.com/zr-tex8r
