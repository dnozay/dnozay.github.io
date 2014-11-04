
var spawn = require('child_process').spawn;
var byline = require('byline');
var chalk = require('chalk');
var _ = require('lodash');
var gulp = require('gulp');

var cssmin = require('gulp-cssmin');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var serve = require('gulp-serve');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var options = {
  yeoman: {
    app: 'app',
    dist: 'dist'
  },
  jekyll: {
    dest: '.jekyll',
    config: '_config.yml,_config.build.yml'
  }
};

// poor-man's grunt-template
function _c(template) {
  return _.template(template, options);
}

// build css files
gulp.task('styles', function() {
  var paths = [ _c('<%= yeoman.app %>/**/*.{sass,scss}') ];
  var loadPath = [ _c('<%= yeoman.app %>/_bower_components') ];
  return gulp.src(paths)
    .pipe(sass({ sourcemap:false, loadPath: loadPath}))
    .pipe(rename({dirname:'css', verbose: false}))
    .pipe(gulp.dest(options.jekyll.dest))
    .pipe(gulp.dest(options.yeoman.dist));
});

// copy images and fonts
gulp.task('images', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/img/**/*.{jpg,jpeg,png}') ];
  var base = _c('<%= yeoman.app %>');
  return gulp.src(paths, {base: base})
    .pipe(gulp.dest(options.jekyll.dest))
    .pipe(gulp.dest(options.yeoman.dist));
});
gulp.task('fonts', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/**/fonts/**/*.{eot*,otf,svg,ttf,woff}') ];
  return gulp.src(paths)
    .pipe(rename({dirname:'fonts', verbose: false}))
    .pipe(gulp.dest(options.jekyll.dest))
    .pipe(gulp.dest(options.yeoman.dist));
});

// build html files
gulp.task('jekyll:build', function (callback) {
    var jekyll = spawn('jekyll', ['build',
      '--source',      _c('<%= yeoman.app %>'),
      '--destination', _c('<%= jekyll.dest %>'),
      '--config',      _c('<%= jekyll.config %>'),
      '--verbose']);
    var line_out = byline(jekyll.stdout);
    var line_err = byline(jekyll.stderr);
    line_out.on('data', function (data) {
        console.log(chalk.green('[jekyll] ') + data);
    });
    line_err.on('data', function (data) {
        console.log(chalk.red('[jekyll] ') + data);
    });
    jekyll.on('exit', function (code) {
        console.log(chalk.yellow('[jekyll] done.'));
        callback();
    })
});

// replace assets references
gulp.task('html', ['jekyll:build','styles'], function () {
    var paths = [ _c('<%= jekyll.dest %>/**/*.html') ];
    var searchPath = [
      _c('<%= yeoman.app %>'),
      _c('<%= jekyll.dest %>'),
      _c('<%= yeoman.app %>/_bower_components')
    ];
    var assets = useref.assets({searchPath: searchPath});
    return gulp.src(paths)
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(options.jekyll.dest));
});

gulp.task('stage', ['html'], function() {
    // do nothing. this is only for task ordering
});

// serve
gulp.task('jekyll:serve', ['html','images','fonts'], function (callback) {
    var jekyll = spawn('jekyll', ['serve', '--skip-initial-build',
      '--source',      _c('<%= yeoman.app %>'),
      '--destination', _c('<%= jekyll.dest %>'),
      '--config',      _c('<%= jekyll.config %>'),
      '--verbose']);
    var line_out = byline(jekyll.stdout);
    var line_err = byline(jekyll.stderr);
    line_out.on('data', function (data) {
        console.log(chalk.green('[jekyll] ') + data);
    });
    line_err.on('data', function (data) {
        console.log(chalk.red('[jekyll] ') + data);
    });
    jekyll.on('exit', function (code) {
        console.log(chalk.yellow('[jekyll] done.'));
        callback();
    })
});

// default task
gulp.task('default', ['jekyll:serve']);
