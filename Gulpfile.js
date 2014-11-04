
var gulp = require('gulp');
var serve = require('gulp-serve');
var spawn = require('child_process').spawn;
var byline = require('byline');
var chalk = require('chalk');
var _ = require('lodash');
var sass = require('gulp-ruby-sass');


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

// build html files
gulp.task('jekyll:serve', function () {
    var jekyll = spawn('jekyll', ['serve', '--watch',
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
        console.log('-- Finished Jekyll Build --')
    })
});

// build css files
gulp.task('styles', function() {
  var paths = [ _c('<%= yeoman.app %>/**/*.{sass,scss}') ];
  var loadPath = [ _c('<%= yeoman.app %>/_bower_components') ];
  return gulp.src(paths)
    .pipe(sass({ sourcemap:false, loadPath: loadPath}))
    .pipe(gulp.dest(options.jekyll.dest))
    .pipe(gulp.dest(options.yeoman.dist));
});

// default task
gulp.task('default', ['jekyll:serve']);
