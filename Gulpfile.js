
var gulp = require('gulp');
var serve = require('gulp-serve');
var spawn = require('child_process').spawn;
var byline = require('byline');
var chalk = require('chalk');


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

gulp.task('jekyll:serve', function () {
    var jekyll = spawn('jekyll', ['serve', '--watch',
      '--source', options.yeoman.app,
      '--destination', options.jekyll.dest,
      '--config', options.jekyll.config,
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

gulp.task('default', ['jekyll:serve']);
