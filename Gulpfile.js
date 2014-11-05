
var spawn = require('child_process').spawn;
var byline = require('byline');
var chalk = require('chalk');
var _ = require('lodash');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var lazypipe = require('lazypipe');

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
    .pipe(gulp.dest(options.jekyll.stage))
    .pipe(gulp.dest(options.yeoman.dist));
});

// copy images and fonts
gulp.task('images', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/img/**/*.{jpg,jpeg,png}') ];
  var base = _c('<%= yeoman.app %>');
  return gulp.src(paths, {base: base})
    // .pipe(gulp.dest(options.jekyll.stage))
    .pipe(gulp.dest(options.yeoman.dist));
});
gulp.task('fonts', ['stage'], function() {
  var paths = [ _c('<%= yeoman.app %>/**/fonts/**/*.{eot*,otf,svg,ttf,woff}') ];
  return gulp.src(paths)
    .pipe(rename({dirname:'fonts', verbose: false}))
    // .pipe(gulp.dest(options.jekyll.stage))
    .pipe(gulp.dest(options.yeoman.dist));
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
      .pipe(uglify)
      .pipe(gulp.dest, options.yeoman.dist);
    var jsTasks =  lazypipe()
      .pipe(cssmin)
      .pipe(gulp.dest, options.yeoman.dist);

    var paths = [
      _c('<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}'),
      _c('!<%= yeoman.app %>/_bower_components/**/*')
    ];
    var searchPath = [
      _c('<%= yeoman.app %>'),
      _c('<%= jekyll.stage %>'),
      _c('<%= yeoman.app %>/_bower_components')
    ];
    var assets = useref.assets({searchPath: searchPath});
    return gulp.src(paths)
        .pipe(assets)
        .pipe(gulpif('*.js', cssTasks()))
        .pipe(gulpif('*.css', jsTasks()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(options.jekyll.stage));
});

// since jekyll likes to clobber destination
// we need to specify a temp directory as a destination.
gulp.task('stage', ['html:build'], function() {
    var source      = [ _c('<%= jekyll.build %>/**/*') ];
    var destination = _c('<%= yeoman.dist %>');
    return gulp.src(source)
        .pipe(gulp.dest(destination));
});

// serve
gulp.task('serve', ['stage','images','fonts'], function() {
    browserSync({
        server: {
            baseDir: _c('<%= yeoman.dist %>')
        }
    });
});

// default task
gulp.task('default', ['serve']);
