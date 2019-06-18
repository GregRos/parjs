import {Application, ReflectionFlag, ReflectionKind} from "typedoc";
import globby from "globby";
import {exec} from "shelljs";

import {CommentPlugin} from "typedoc/dist/lib/converter/plugins";

async function run() {
    let files = await globby(["./src/lib/**/*.ts", "./src/lib/*.ts", "!**/*.ranges.ts"], {
        absolute: true
    });

    let app = new Application({
        module: "commonjs",
        target: "es6",
        plugin: [
            "typedoc-plugin-external-module-name",
            "typedoc-plugin-internal-external",
            "typedoc-plugin-example-tag"
        ],
        excludePrivate: true,
        excludeExternals: true,
        esModuleInterop: true,
        files
    });

    let rs = app.convert(files)!;
    rs.files.forEach(file => {
        file.reflections.slice().forEach(r => {

            if (r.flags.hasFlag(ReflectionFlag.External)) {
                console.log(r.name);
                CommentPlugin.removeReflection(rs, r);
            }
            if (r.kind === ReflectionKind.Global) {
                CommentPlugin.removeReflection(rs, r);
            }
        });
    });



    console.log(rs.getReflectionsByKind(ReflectionKind.SomeModule).map(x => x.name));
    exec("rm -rf docs/");
    app.generateDocs(rs, "docs");

}

run();
