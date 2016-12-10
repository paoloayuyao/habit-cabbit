/**
 * Created by jayuyao on 10/29/2016.
 */
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var connect = require('gulp-connect');
var runSequence = require('run-sequence')
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('dev:inject', function(){
  return gulp.src('*.html')
    .pipe(wiredep({
      exclude: ['bower_components/bootstrap/dist/js/bootstrap.js', '/jquery/']
    }))
    .pipe(inject(
      gulp.src(['app/*.js','app/**/*.js', 'app/**/**/*.js']).pipe(angularFilesort())))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev:html', function(){
  return gulp.src(['app/**/**/*+(html)'])
    .pipe(gulp.dest('dist/app'));
})

gulp.task('dev:scripts', function(){
  return gulp.src(['app/**/*.js', 'app/**/*.js', 'app/**/**/*+(js)'])
    .pipe(gulp.dest('dist/app'));
})

gulp.task('dev:assets', function(){
  return gulp.src(['assets/**/*.*'])
    .pipe(gulp.dest('dist/assets'));
})

gulp.task('dev:build', ['watch'], function(){
  runSequence(['dev:inject', 'dev:scripts', 'dev:assets', 'dev:html']);
})

gulp.task('dev:build', ['watch'], function(){
  runSequence(['dev:inject', 'dev:scripts', 'dev:assets', 'dev:html']);
})

gulp.task('watch', function(){
  gulp.watch(['*.html'], ['dev:inject']);
  gulp.watch(['app/**/*.js', 'app/**/*.js', 'app/**/**/*+(js)'], ['dev:scripts']);
  gulp.watch(['assets/**/*.*'], ['dev:assets']);
  gulp.watch(['app/**/**/*+(html)'], ['dev:html']);
})

gulp.task('dev:serve', ['dev:build'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist',
      routes: {
        "/bower_components": "bower_components"
      }
    },
  });
})

/* PRODUCTION SCRIPTS */

gulp.task('prod:inject', ['prod:assets'], function(){
  return gulp.src('*.html')
    .pipe(wiredep({
      exclude: ['bower_components/bootstrap/dist/js/bootstrap.js', '/jquery/']
    }))
    .pipe(inject(
      gulp.src(['app/*.js','app/**/*.js', 'app/**/**/*.js']).pipe(angularFilesort())))
    .pipe(useref())
    // .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('prod'));
});

gulp.task('prod:assets', function(){
  return gulp.src(['assets/**/*.*', '!assets/**/*.css'])
    .pipe(gulp.dest('prod/assets'));
})

gulp.task('prod:html', function(){
  return gulp.src(['app/**/**/*+(html)'])
    .pipe(gulp.dest('prod/app'));
})

gulp.task('prod:fonts', function() {
  return gulp.src([
    'bower_components/font-awesome/fonts/fontawesome-webfont.*',
    'bower_components/bootstrap/fonts/*.*'])
    .pipe(gulp.dest('prod/fonts/'));
});

gulp.task('prod:build', function(){
  runSequence(['prod:inject', 'prod:assets', 'prod:html', 'prod:fonts']);
})


gulp.task('prod:serve', ['prod:build'], function() {
  browserSync.init({
    server: {
      baseDir: 'prod'
    }
  });
})

