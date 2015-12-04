'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var exit = require('gulp-exit');

gulp.task('lint', function () {
  return gulp.src(['src/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src('test/*.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(exit());
});

gulp.task('default', ['lint', 'test']);
