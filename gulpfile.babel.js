import gulp     from "gulp";
import del      from "del";
import babel    from "gulp-babel";

const config = {
    in: "src/",
    out: "dist/"
};

export const clean = done => 
    del([`${config.out}*`], done);

export const source = () =>
    gulp.src([`${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(babel())
        .pipe(gulp.dest(config.out));

export const content = gulp.series(() =>
    gulp.src([`${config.in}**`, `!${config.in}**/*.js`], { base: `${config.in}` })
        .pipe(gulp.dest(config.out)));

export const build = gulp.series(clean, source, content);

export const watch = () =>
    gulp.watch([`${config.in}**/*.*`], gulp.series(build));

export default build;