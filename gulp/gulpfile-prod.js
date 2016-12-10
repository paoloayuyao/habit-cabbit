/**
 * Created by jayuyao on 10/29/2016.
 */

// note to self: gulp-load-plugins is a game changer

var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var wiredep = require('wiredep').stream;

var connect = require('gulp-connect');
var runSequence = require('run-sequence')

var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');

// converts sass files to css files
gulp.task('sass', ['test:gulp'], function () {
    return gulp.src('app/assets/scss/*.scss').pipe(sass()).pipe(gulp.dest('app/assets/css'));
});

// minifies javascript and css files
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
//        .pipe(gulpIf('*.js', uglify()))
//        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('components', function(){
    return gulp.src('app/components/**/*.html').pipe(gulp.dest('dist/components'));
});

gulp.task('shared', function(){
    return gulp.src('app/shared/**/*.html').pipe(gulp.dest('dist/shared'));
});

gulp.task('dev:inject', function(){
  return gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bower_components/bootstrap/dist/js/bootstrap.js', '/jquery/']
    }))
    //        .pipe(gulpIf('*.js', uglify()))
    //        .pipe(gulpIf('*.css', cssnano()))
    .pipe(inject(
      gulp.src(['app/*.js','app/**/*.js', 'app/**/**/*.js']).pipe(angularFilesort())))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev:copy', function(){
  return gulp.src(['app/**/*.js', 'app/**/*.js', 'app/**/**/*+(js|html)'])
    .pipe(gulp.dest('dist/app'));
})

/*gulp.task('jangular', function(){
  return gulp.src('app/index.html')
    .pipe(inject(
      gulp.src(['app/!*.js','app/!**!/!*.js', 'app/!**!/!**!/!*.js']).pipe(angularFilesort())
    )).pipe(gulp.dest('dist'));
});*/

gulp.task('dev:build', function(){
  runSequence(['dev:inject', 'dev:copy']);
})

gulp.task('dev:serve', ['dev:build'], function() {
  connect.server({
    root: 'dist',
    livereload: true,
    middleware:function(connect, opt){
      return [['/bower_components',
        connect["static"]('./bower_components')]]
    }
  });
});

/*gulp.task('dev:serve', ['dev:build'], function() {
 connect.server({
 root: 'dist',
 livereload: true,
 middleware:function(connect, opt){
 return [['/bower_components',
 connect["static"]('./bower_components')]]
 }
 });
 });*/


