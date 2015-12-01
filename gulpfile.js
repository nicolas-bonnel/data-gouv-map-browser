var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

gulp.task('concat-app-js',function(){
  return gulp.src('./src/**/*.js')
  .pipe(concat('1-app.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('concat-app-css',function(){
  return gulp.src('./src/**/*.css')
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('concat-vendor-js',function(){
  return gulp.src(mainBowerFiles('**/*.js'), { base: '/bower_components'})
  .pipe(concat('0-vendor.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('concat-vendor-css',function(){
  return gulp.src(mainBowerFiles('**/*.css'), { base: '/bower_components'})
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./dist'));
});


gulp.task('concat', gulp.parallel(['concat-app-js','concat-app-css','concat-vendor-js','concat-vendor-css']));

gulp.task('templates', function () {
  return gulp.src('src/views/**/*.html')
    .pipe(templateCache('2-app.tpl.js',{
      module: 'app'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false});
  return target.pipe(inject(sources,{
    addRootSlash: false,
    ignorePath : 'dist'
  }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


gulp.task('default',  gulp.series(['concat','templates','index']));
