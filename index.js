#!/usr/bin/env node

// いちおう、Bashで入力補完が効くようになった。
// タブを1回だけ押したときに入力補完が決まるようになった。
// それから、ファイルのパスの入力補完も効くようになった。
// >> $ complete -C "pseudoalias --config ./example.js --completion" -o default pseudoalias
// >> 2026/01/27 21:36.

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

// >> $ ./index.js --config example.js
// >> $ ./index.js --config example.js greetings
// >> $ ./index.js --config example.js addition 1 2

// >> $ ./index.js --config ./example.js --register
// >> $ ./index.js greetings
// >> $ ./index.js addition 1 2
// >> $ ./index.js --unregister

import { os, fs, path, argv } from "zx";
import { pathToFileURL } from "node:url";

const CONFIG_DIR = path.join(os.homedir(), ".pseudoalias");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.js");

const commands = argv._;
// console.log(commands);

const config = argv.config;
// console.log(argv);
// process.exit(0);

/*
const completion = argv.completion;
*/

if (argv.register) {
	if (argv.config) {
		const absConfigPath = path.resolve(argv.config);
		const configData = fs.readFileSync(absConfigPath, "utf-8");

		await fs.ensureDir(CONFIG_DIR);

		await fs.writeFile(CONFIG_FILE, configData, "utf-8");

		console.log(`Success: Registered config path to ${absConfigPath}`);
		console.log(`Stored in: ${CONFIG_FILE}`);
	} else {
		console.error("Error: --config is required with --register");
	}
	process.exit(0);
}

if (argv.unregister) {
	if (await fs.exists(CONFIG_DIR)) {
		await fs.remove(CONFIG_DIR);
		console.log("Success: Unregistered and removed configuration.");
	} else {
		console.log("Notice: No configuration found to unregister.");
	}
	process.exit(0);
}

let targetFile = config;

if (!targetFile) {
	if (fs.existsSync(CONFIG_FILE)) {
		targetFile = CONFIG_FILE;
	} else {
		process.exit(1);
	}
}
// console.log(targetFile);
// process.exit(0);

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

	/*
	if (completion) {
		const args2 = process.argv;
		const prevWord = args2[args2.length - 1];
		const currentWord = args2[args2.length - 2];

		if (prevWord === "pseudoalias") {
			const candidates = Object.keys(aliasModule).filter((k) => k !== "default");
			const filtered = candidates.filter((c) => c.startsWith(currentWord));
			if (filtered.length > 0) {
				console.log(filtered.join("\n"));
			}
			process.exit(0);
		}
		process.exit(0);
	}
	*/

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
