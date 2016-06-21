// Include gulp
gulp = require("gulp");

// Include plugins
autoprefixer = require('gulp-autoprefixer'),
  browserSync = require("browser-sync").create(),
  concat = require("gulp-concat"),
  del = require('del'),
  jade = require('gulp-jade'),
  jshint = require("gulp-jshint"),
  plumber = require("gulp-plumber"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify");

// Folders
var src = "src/",
  srcFonts = src + "fonts/*",
  srcImages = src + "img/**/*",
  srcJs = src + "js/*.js",
  srcJsVendor = src + "js/vendor/*.js",
  srcStyle = src + "scss/**/*.scss",
  srcTemplates = src + "templates/**/*.jade",
  dist = "dist/",
  distFonts = dist + "fonts/",
  distImages = dist + "img/",
  distJs = dist + "js/",
  distStyle = dist + "css/";
  distTemplates = dist,

// Browser-sync server
gulp.task("serve", ["deleteDist", "fonts", "images", "sass", "js", "templates", "vendor"], function() {

  browserSync.init({
    server: dist,
    startPath: "/homepage.html",
    open: false
  });

  gulp.watch(srcFonts, ["fonts"]);
  gulp.watch(srcImages, ["images"]);
  gulp.watch(srcJs, ["js"]);
  gulp.watch(srcJsVendor, ["vendor"]);
  gulp.watch(srcStyle, ["sass"]);
  gulp.watch(srcTemplates, ["templates"]);

});

// Delete dist
gulp.task('deleteDist', function() {
  return del.sync(dist);
})

// Copy fonts
gulp.task("fonts", function() {
  return gulp.src(srcFonts)
    .pipe(gulp.dest(distFonts))
    .pipe(browserSync.stream());
});

// Create template
gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  return gulp.src(srcTemplates)
    .pipe(jade({
      pretty: '\t',
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest(distTemplates))
    .pipe(browserSync.stream());
});

// Copy HTML
gulp.task("images", function() {
  return gulp.src(srcImages)
    .pipe(gulp.dest(distImages))
    .pipe(browserSync.stream());
});

// Lint Task
gulp.task("lint", function() {
  return gulp.src(srcJs)
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

// Compile sass
gulp.task("sass", function() {
  return gulp.src(srcStyle)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 3 iOS versions'],
      cascade: false,
      flexbox: true,
    }))
    .pipe(gulp.dest(distStyle))
    .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task("js", function() {
  return gulp.src(srcJs)
    .pipe(concat("scripts.js"))
    // .pipe(uglify()
    //     .pipe(plumber())
    .pipe(gulp.dest(distJs))
    .pipe(browserSync.stream());
});

// Concatenate & Minify vendor JS
gulp.task("vendor", function() {
  return gulp.src(srcJsVendor)
    .pipe(concat("vendor.js"))
    // .pipe(uglify()
    //     .pipe(plumber())
    .pipe(gulp.dest(distJs))
    .pipe(browserSync.stream());
});

// Default Task
gulp.task("default", ["serve"]);
