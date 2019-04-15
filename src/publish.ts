import execa = require("execa");
import globby = require("globby");
import path = require("path");
import fs = require("mz/fs");
import mkdirp = require("mkdirp-promise");
import {createProgram, ModuleKind, ScriptTarget, getPreEmitDiagnostics, flattenDiagnosticMessageText} from "typescript";
import {RawSourceMap} from "source-map";
import * as assert from "assert";

async function copyFileAsync(src, dest) {
    return new Promise((rs, rj) => {
        fs.copyFile(src, dest, err => {
            if (err) rj(err);
            rs();
        })
    })
}

async function run() {
    await execa.shell("rm -rf .tmp/publish/");
    await execa.shell("mkdir -p .tmp/publish/src");

    let program = createProgram(globby.sync("src/lib/**/*.ts"), {
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2015,
        noImplicitAny: false,
        sourceMap: true,
        allowUnreachableCode: true,
        lib: ["lib.es2015.d.ts"],
        declaration: true,
        rootDir: "src/lib",
        outDir: ".tmp/publish",
    });
    let res = program.emit()
    let allDiagnostics =
        getPreEmitDiagnostics(program)
        .concat(res.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            let message = flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            );
            console.log(
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            );
        } else {
            console.log(
                `${flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            );
        }
    });
    let copyExtras = await globby(["package.json", "LICENSE.md", "README.md"]).then(misc => {
        return Promise.all(misc.map(cur => {
            return copyFileAsync(cur, path.join(`.tmp/publish/${path.basename(cur)}`));
        }))
    });


    let copySources = await globby("src/lib/**/*.ts").then(async sources => {
        ;
        return Promise.all(sources.map(async cur => {
            let rel = path.relative("src/lib", cur);
            let targetFile = path.join(".tmp/publish/src", rel);
            await mkdirp(path.dirname(targetFile));
            return copyFileAsync(cur, targetFile);
        }))


    })

    let sourceMaps = await globby(".tmp/publish/**/*.map").then(maps => {
        return Promise.all(maps.map(async map => {
            let text = await fs.readFile(map, {encoding: "utf8"});
            let json = JSON.parse(text) as RawSourceMap;
            let relToRoot = path.relative(".tmp/publish", map);
            let sourcePath = path.join(".tmp/publish/src", relToRoot);
            let tsFile = sourcePath.replace(/\.js\.map/g, ".ts");
            let x = 1;
            assert(await fs.exists(tsFile));
            let relTsFile = path.relative(path.dirname(map), tsFile);

            json.sources = [
                relTsFile
            ];
            let text2 = JSON.stringify(json);
            await fs.writeFile(map, text2, {encoding: "utf8"});

        }))
    });

}

run();

//
// {
//  "compilerOptions": {
//    "module": "commonjs",
//    "target": "es6",
//    "noImplicitAny": false,
//    "sourceMap": true,
//    "allowUnreachableCode": true,
//    "lib": [
//      "es6",
//      "dom",
//      "es2015.collection"
//    ],
//    "declaration": true,
//    "sourceRoot": "src",
//    "outDir": ".tmp/publish",
//    "rootDir" : "src/lib"
//  },
//  "include": [
//    "src/lib/**/*.ts"
// ],
// "exclude": [
//     "dist",
//     "node_modules"
// ]
// }
