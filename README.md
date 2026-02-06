## pseudoalias

pseudoaliasは、擬似的なエイリアスを作成することができるコマンドラインのツールです。  
.bashrcなどにエイリアスを書くよりも、JavaScriptでエイリアスを書けるようになるので、書きやすいような気がします。

## インストール

```bash
$ npm install --global @kokiito0926/pseudoalias
```

## 使用方法

設定のファイルにエイリアスを記述します。

```javascript
export const greetings = async () => {
	console.log("Hello, world!");
};

export const addition = async (one, two) => {
	console.log(Number(one) + Number(two));
};

export const subtraction = async (one, two) => {
	console.log(Number(one) - Number(two));
};

export const multiplication = async (one, two) => {
	console.log(Number(one) * Number(two));
};

export const division = async (one, two) => {
	console.log(Number(one) / Number(two));
};
```

--configのオプションに設定のファイルを指定します。  
そうしたら、定義されているエイリアスを実行することができます。

```bash
$ pseudoalias --config ./example.js greetings
$ pseudoalias --config ./example.js addition 1 2
$ pseudoalias --config ./example.js subtraction 2 1
```

エイリアスを書かずに実行した場合、エイリアスの一覧が表示されます。

```bash
$ pseudoalias --config ./example.js
```

--registerのオプションを用いると、ホームディレクトリに設定のファイルが保存されます。  
それ以降は、--configのオプションを用いなくても、定義されているエイリアスを実行することができます。

```bash
$ pseudoalias --config ./example.js --register

$ pseudoalias greetings
$ pseudoalias addition 1 2
$ pseudoalias subtraction 2 1
```

--unregisterのオプションを用いると、ホームディレクトリから設定のファイルを削除します。

```bash
$ pseudoalias --unregister
```

下記のコマンドを.bashrcなどに追記すると、入力補完が効くようになります。

```bash
$ complete -C "pseudoalias --completion" -o default pseudoalias
```

## ライセンス

[MIT](LICENSE)
