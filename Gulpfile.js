
var spawn = require('child_process').spawn;
var byline = require('byline');
var chalk = require('chalk');
var _ = require('lodash');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var lazypipe = require('lazypipe');
var path = require('path');

var cssmin = require('gulp-cssmin');
var debug = require('gulp-debug');
var filerev = require('gulp-rev');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var revall = require('gulp-rev-all');
var sass = require('gulp-ruby-sass');
var serve = require('gulp-serve');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var options = {
  yeoman: {
    stage: '.tmp',
    app: 'app',
    dist: 'dist'
  },
  jekyll: {
    stage: '.jekyll',
    build: '.jekyll-dest',
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
    .pipe(gulp.dest(options.jekyll.stage));
});

// copy images and fonts
gulp.task('images', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}') ];
  var base = _c('<%= yeoman.app %>');
  return gulp.src(paths, {base: base})
    .pipe(rename({dirname:'img', verbose: false}))
    .pipe(gulpif('*.svg', svgmin()))
    .pipe(gulp.dest(options.yeoman.stage));
});
gulp.task('fonts', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/**/fonts/**/*.{eot*,otf,svg,ttf,woff}') ];
  return gulp.src(paths)
    .pipe(rename({dirname:'fonts', verbose: false}))
    .pipe(gulp.dest(options.yeoman.stage));
});

// build html files
gulp.task('html:build', ['html:prep'], function (callback) {
    var jekyll = spawn('jekyll', ['build',
      '--source',      _c('<%= jekyll.stage %>'),
      '--destination', _c('<%= jekyll.build %>'),
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
    });
});

// replace assets references
gulp.task('html:prep', ['styles'], function () {
    var cssTasks = lazypipe()
      .pipe(cssmin);
    var jsTasks = lazypipe()
      .pipe(uglify);

    var paths = [
      _c('<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}'),
      _c('!<%= yeoman.app %>/_bower_components/**/*')
    ];
    var searchPath = [
      _c('<%= yeoman.app %>'),
      _c('<%= jekyll.stage %>'),
      _c('<%= yeoman.app %>/_bower_components')
    ];
    var assets = useref.assets({
        searchPath: searchPath,
        types: ['css','js','gif','jpg','jpeg','png','svg','webp']
    });
    return gulp.src(paths)
        .pipe(assets)
            .pipe(gulpif('*.js', jsTasks()))
            .pipe(gulpif('*.css', cssTasks()))
            // do not use filerev() as it interferes with gulp-rev-all
            // .pipe(filerev())
            .pipe(gulp.dest(options.yeoman.stage))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(options.jekyll.stage));
});

// since jekyll likes to clobber destination
// we need to specify a temp directory as a destination.
gulp.task('stage', ['html:build'], function() {
    var base        = _c('<%= jekyll.build %>');
    var source      = [ _c('<%= jekyll.build %>/**/*') ];
    var destination = _c('<%= yeoman.stage %>');
    return gulp.src(source)
        .pipe(gulpif('*.html', htmlmin({
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          removeRedundantAttributes: true
        })))
        .pipe(gulp.dest(destination));
});

gulp.task('filerev', ['stage','images','fonts'], function() {
    var base = _c('<%= yeoman.stage %>');
    var dist = _c('<%= yeoman.dist %>');
    var allfiles = _c('<%= yeoman.stage %>/**');
    return gulp.src(allfiles)
        .pipe(revall({
            ignore: [/^\/favicon.ico$/g, '.html'],
            base: base,
            hashLength: 8
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('copy', function() {
    var dist = _c('<%= yeoman.dist %>');
    return gulp.src([
          'LICENSE',
          'README.md',
          _c('<%= yeoman.app %>/_config.yml')
      ])
      .pipe(rename({dirname:'', verbose: false}))
      .pipe(gulp.dest(dist));
});

// serve
gulp.task('serve', ['filerev','copy'], function() {
    browserSync({
        server: {
            baseDir: _c('<%= yeoman.dist %>')
        }
    });
});

// default task
gulp.task('default', ['serve']);
