import {Application} from "typedoc";
import {TestPlugin} from "./test";
import globby = require("globby");
import * as execa from "execa";

async function run() {
	let app = new Application({
		module : "commonjs",
		target : "es6"
	});

	let files = await globby(["./src/lib/**/*.ts", "./src/lib/*.ts"]);
	await execa.shell("rm -rf docs/");
	app.converter.addComponent("test", TestPlugin);

	app.generateDocs(files, "docs")
}

run()
