import gulp from 'gulp';
import eslint from 'gulp-eslint';

const js = [
  'src/**/*.js',
  'examples/**/*.js'
];

gulp.task('lint', () => {
  return gulp.src(js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
