import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';

import exec from './src/packages/cli/utils/exec';
import rmrf from './src/packages/cli/utils/rmrf';

gulp.task('clean', () => {
  return rmrf('dist');
});

gulp.task('build', ['lint', 'clean'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:test', ['build'], () => {
  return exec('npm install', {
    cwd: `${__dirname}/test/test-app`
  });
});

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['build:test'], () => {
  return gulp.src([
    'test/helper.js',
    'test/unit/**/*.js',
    'test/integration/**/*.js'
  ], { read: false })
    .pipe(
      mocha({
        bail: true,
        timeout: 600000,
        require: [
          'babel-core/register'
        ]
      })
    )
    .once('error', () => process.exit(1))
    .once('end', () => process.exit());
});

gulp.task('default', ['build']);
