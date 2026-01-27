#!/usr/bin/env node

// いちおう、入力補完のコマンドを書いておいたほうがいい。
// -oのオプションにdefaultを指定していても、ファイルのパスの入力補完が効かない。
// >> $ complete -p
// >> $ complete -r pseudoalias
// >> $ complete -C "./index.js --config ./example.js --completion" -o default pseudoalias
// >> 2026/01/27 20:53.

// 入力補完の単語を表示する機能を実装した。
// >> $ ./index.js --config ./example.js --completion
// >> 2026/01/27 20:18.

// ホームディレクトリに設定のファイルを保存できるようにする。
// そのようにすれば、コマンドをより短くすることができると思う。
// そのような処理を実装するのであれば、os.homedir関数を用いればいいような気がする。
// >> 2026/01/27 18:33.

// >> $ node ./index.js --config example.js
// >> $ node ./index.js --config example.js greetings
// >> $ node ./index.js --config example.js addition 1 2

import { minimist, fs, path, argv } from "zx";
import { pathToFileURL } from "node:url";

const commands = argv._;

const args = minimist(process.argv.slice(2));
const config = args.config;
const completion = args.completion;
// console.log(argv);
// console.log(args);
// process.exit(0);

// console.log("aaaa\nbbbb\ncccc");
// process.exit(0);

const targetFile = config;
if (!targetFile) {
	process.exit(0);
}

// const targetPath = targetFile;
const targetPath = path.resolve(targetFile);
if (!targetPath) {
	process.exit(0);
}
// console.log(targetPath);
// process.exit(0);

try {
	const aliasModule = await import(pathToFileURL(targetPath).href);
	const [subCommand, ...restArgs] = commands;
	// console.log(subCommand);
	// console.log(restArgs);
	// process.exit(0);

	const prevWord = process.argv[process?.argv?.length - 1];
	const currentWord = process.argv[process?.argv?.length - 2];

	if (completion) {
		// fs.writeFileSync("./temp.txt", prevWord, "utf-8");
		// fs.writeFileSync("./temp.txt", currentWord, "utf-8");
		// process.exit(0);

		if (prevWord === "pseudoalias") {
			const availableFunctions = Object.keys(aliasModule).filter((k) => k !== "default");
			console.log(availableFunctions.join("\n"));
			process.exit(0);
		}
		process.exit(0);
	}

	if (!subCommand) {
		const availableFunctions = Object.keys(aliasModule).filter((k) => k !== "default");
		console.log("Available aliases:");
		if (availableFunctions.length === 0) {
			console.log("Error: Not found aliases.");
		} else {
			availableFunctions.forEach((fn) => console.log(`  - ${fn}`));
		}
		process.exit(0);
	}

	if (typeof aliasModule[subCommand] === "function") {
		await aliasModule[subCommand](...restArgs);
	} else {
		console.error(`Error: Command "${subCommand}" is not registered.`);
	}
} catch (err) {
	console.error("Error: Execution error");
	console.error(err);
}
