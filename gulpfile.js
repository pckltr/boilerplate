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
var dev = "src/",
	devFonts = dev + "fonts/*",
	devImages = dev + "img/**/*",
	devScripts = dev + "scripts/*.js",
	devScriptsVendor = dev + "scripts/vendor/*.js",
	devStyle = dev + "scss/**/*.scss",
	devTemplates = dev + "templates/**/*.jade",
	dist = "dist/",
	distFonts = dist + "fonts/",
	distImages = dist + "img/",
	distScripts = dist + "js/",
	distStyle = dist + "css/";
	distTemplates = dist,

// Browser-sync server
gulp.task("serve", ["deleteDist", "fonts", "images", "sass", "scripts", "templates", "vendor"], function() {

	browserSync.init({
		server: dist,
		startPath: "/homepage.html",
		open: false
	});

	gulp.watch(devFonts, ["fonts"]);
	gulp.watch(devImages, ["images"]);
	gulp.watch(devScripts, ["scripts"]);
	gulp.watch(devScriptsVendor, ["vendor"]);
	gulp.watch(devStyle, ["sass"]);
	gulp.watch(devTemplates, ["templates"]);

});

// Delete dist
gulp.task('deleteDist', function() {
	return del.sync(dist);
})

// Copy fonts
gulp.task("fonts", function() {
	return gulp.src(devFonts)
		.pipe(gulp.dest(distFonts))
		.pipe(browserSync.stream());
});

// Create template
gulp.task('templates', function() {
	var YOUR_LOCALS = {};
	return gulp.src(devTemplates)
		.pipe(jade({
			pretty: '\t',
			locals: YOUR_LOCALS
		}))
		.pipe(gulp.dest(distTemplates))
		.pipe(browserSync.stream());
});

// Copy HTML
gulp.task("images", function() {
	return gulp.src(devImages)
		.pipe(gulp.dest(distImages))
		.pipe(browserSync.stream());
});

// Lint Task
gulp.task("lint", function() {
	return gulp.src(devScripts)
		.pipe(jshint())
		.pipe(jshint.reporter("default"));
});

// Compile sass
gulp.task("sass", function() {
	return gulp.src(devStyle)
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
gulp.task("scripts", function() {
	return gulp.src(devScripts)
		.pipe(concat("scripts.js"))
		// .pipe(uglify()
		//     .pipe(plumber())
		.pipe(gulp.dest(distScripts))
		.pipe(browserSync.stream());
});

// Concatenate & Minify vendor JS
gulp.task("vendor", function() {
	return gulp.src(devScriptsVendor)
		.pipe(concat("vendor.js"))
		// .pipe(uglify()
		//     .pipe(plumber())
		.pipe(gulp.dest(distScripts))
		.pipe(browserSync.stream());
});

// Default Task
gulp.task("default", ["serve"]);
