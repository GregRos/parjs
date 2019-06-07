import {retargetSourcemaps} from "retarget-sourcemaps-after-move";
import {rm, mkdir, cp} from "shelljs";
function run() {
    let pub = ".tmp/publish";
    let srcRoot = "src/lib";
    rm("-rf", pub);
    mkdir("-p", pub);
    cp("-r", [
        "package.json",
        "LICENSE.md",
        "README.md"
    ], pub);
    cp("-r", "dist/lib/.", pub);
    cp("-r", "src/lib/.", `${pub}/src`);
    retargetSourcemaps({
        srcRoot: {
            old: srcRoot,
            new: `${pub}/src`
        },
        distRoot: {
            old: "dist/lib",
            new: ".tmp/publish"
        },
        distGlob: "**/*.js"
    });
}
run();
