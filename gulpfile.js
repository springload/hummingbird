var fs = require('fs'),
    gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    util   = require('gulp-util'),
    path = require("path");

var concat = require('gulp-concat');
var mochaPhantomJS = require('gulp-mocha-phantomjs');


gulp.task('prepare', function() {
    gulp.src("spec/harness.js")
        .pipe(browserify())
        .pipe(gulp.dest("test"));
});


gulp.task('spec', function() {
    gulp.src(["spec/**/*.spec.js"])
        .pipe(concat('spec/all.js'))
        .pipe(gulp.dest("test"));
});


gulp.task('test', ['prepare', 'spec'], function () {
    return gulp
        .src('test/test.html')
        .pipe(mochaPhantomJS({
            phantomjs: {
                viewportSize: {
                    width: 500,
                    height: 768
                }
            }
        }));
});