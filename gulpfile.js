"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Greg on 25/09/2016.
 */
const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const typedoc = require("gulp-typedoc");
let tsFiles = ['src/**/*.tsx', 'src/**/*.ts'];
let watchToo = ['tsconfig.json'];
let tsProject = ts.createProject('tsconfig.json', { 'sourceMap': true, 'declaration': true });
gulp.task('clean-dist', () => {
    return del([
        'dist/**/*.*'
    ]);
});
gulp.task('compile-ts', () => {
    let tsResult = gulp.src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(sourcemaps.write('.', { sourceRoot: '/src' })).pipe(gulp.dest('dist'))
    ]);
});
gulp.task('watch', ['clean-dist', 'compile-ts'], () => {
    gulp.watch(tsFiles.concat(watchToo), ['clean-dist', 'compile-ts']);
});
gulp.task('typedoc', () => {
    return gulp.src(["src/**/*.ts"])
        .pipe(typedoc({
        exclude: '**/node_modules',
        target: 'es6',
        out: "./docs",
        module: "commonjs",
        // TypeDoc options (see typedoc docs)
        name: "parjs",
        ignoreCompilerErrors: true,
        version: true,
        mode: "modules",
        "lib": ["es6", "es2016.array.include"],
        includeDeclarations: true,
        excludeExternals: true,
        excludePrivate: true
    }));
});
//# sourceMappingURL=gulpfile.js.map