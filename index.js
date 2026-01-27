#!/usr/bin/env node

// >> $ node ./index.js --config example.js
// >> $ node ./index.js --config example.js greetings
// >> $ node ./index.js --config example.js addition 1 2

import { minimist, path, argv } from "zx";
import { pathToFileURL } from "node:url";

const commands = argv._;

const args = minimist(process.argv.slice(2));
const config = args.config;
// console.log(argv);
// console.log(args);
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
