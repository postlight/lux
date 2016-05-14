import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import uglify from 'gulp-uglify';

import rmrf from './src/packages/cli/utils/rmrf';

gulp.task('clean', () => {
  return rmrf('dist');
});

gulp.task('build', ['clean'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], () => {
  return gulp.src([
    'test/helper.js',
    'test/unit/**/*.js',
    'test/integration/**/*.js'
  ], { read: false })
    .pipe(
      mocha({
        bail: true,
        timeout: 60000,
        require: [
          'babel-core/register'
        ]
      })
    )
    .once('error', () => process.exit(1))
    .once('end', () => process.exit());
});

gulp.task('default', ['build']);
