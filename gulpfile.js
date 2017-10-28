const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge2 = require('merge2');
const del = require('del');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const typedoc = require('gulp-typedoc');
const tsProj = ts.createProject('tsconfig.json', {

});

const tsProj2 = ts.createProject('tsconfig.json', {

});


gulp.task('clean', function() {
    return gulp.src('dist').pipe(clean());
});

gulp.task('build', ['clean'], function() {
    var compiledTs = gulp.src(['src/**/*.ts'], {base: "src"})
        .pipe(sourcemaps.init())
        .pipe(tsProj())
        .pipe(sourcemaps.write('./', {
            destPath : 'dist/'
        }))
        .pipe(gulp.dest("dist/"))

    return merge2(compiledTs);
});

gulp.task('watch', ['build'], function() {
    gulp.watch(["src/**/*.ts", "src/**/*.js"], ["build"]);
});

gulp.task('typedoc', () => {
    return gulp.src(["src/lib/**/*.ts"])
        .pipe(typedoc({
            target : 'es6',
            out: "./docs",
            module : "commonjs",
            // TypeDoc options (see typedoc docs)
            name: "parjs",
            version: true,
            mode : "modules",
            includeDeclarations : true,
            excludeExternals : true,
            excludePrivate : true
        }))
});