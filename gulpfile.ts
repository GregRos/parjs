/**
 * Created by Greg on 25/09/2016.
 */
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as merge from 'merge2';
import * as del from 'del';
import * as sourcemaps from 'gulp-sourcemaps';
import * as typedoc from 'gulp-typedoc';

let tsFiles = ['src/**/*.tsx', 'src/**/*.ts'];
let watchToo = ['tsconfig.json'];
let tsProject = ts.createProject('tsconfig.json', {'sourceMap': true, 'declaration': true});

gulp.task('clean-dist', () => {
    return del([
        'dist/**/*.*'
    ]);
});

gulp.task('compile-ts', () => {

    let tsResult =
        gulp.src(tsFiles)
            .pipe(sourcemaps.init())
            .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(sourcemaps.write('.', {sourceRoot: '/src'})).pipe(gulp.dest('dist'))
    ]);
});

gulp.task('watch', ['clean-dist', 'compile-ts'], () => {
    gulp.watch(tsFiles.concat(watchToo), ['clean-dist', 'compile-ts'])
});

gulp.task('typedoc', () => {
   return gulp.src(["src/**/*.ts"])
       .pipe(typedoc({
           exclude : '**/node_modules',
           target : 'es6',
           out: "./docs",
           module : "commonjs",
           // TypeDoc options (see typedoc docs)
           name: "parjs",
           ignoreCompilerErrors: true,
           version: true,
           mode : "modules",
           "lib": ["es6", "es2016.array.include"],
           includeDeclarations : true,
           excludeExternals : true,
           excludePrivate : true
       }))
});