## スードーエイリアス（pseudoalias）

スードーエイリアス（pseudoalias）を用いれば、擬似的なエイリアスを作成することができます。  
.bashrcなどにエイリアスを書くよりも、JavaScriptのファイルにエイリアスを書けたほうが便利かと思いました。

## インストール

```bash
$ npm install --global @kokiito0926/pseudoalias
```

## 実行方法

```bash
$ pseudoalias --config ./example.js
$ pseudoalias --config ./example.js greetings
$ pseudoalias --config ./example.js addition 1 2
$ pseudoalias --config ./example.js subtraction 2 1
```

```bash
$ pseudoalias --config ./example.js --register
$ pseudoalias --unregister

$ pseudoalias greetings
$ pseudoalias addition 1 2
$ pseudoalias subtraction 2 1
```

```bash
$ complete -C "pseudoalias --config ./example.js --completion" -o default pseudoalias
```

## ライセンス

[MIT](LICENSE)
