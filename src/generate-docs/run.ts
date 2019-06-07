import {Application} from "typedoc";
import {ParjsCustomizationPlugin} from "./typedoc-plugin";
import * as execa from "execa";
import globby from "globby";

async function run() {
    let app = new Application({
        module: "commonjs",
        target: "es6",
        plugin: [
            "typedoc-plugin-external-module-name",
            "typedoc-plugin-internal-external",
            "typedoc-plugin-example-tag"
        ]
    });

    let files = await globby(["./src/lib/**/*.ts", "./src/lib/*.ts"]);
    await execa.shell("rm -rf docs/");
    app.converter.addComponent("test", ParjsCustomizationPlugin);

    app.generateDocs(files, "docs");
}

run();
