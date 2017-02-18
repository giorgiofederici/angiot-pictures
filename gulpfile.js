const gulp 			= require('gulp');

// Require Gulp Sass plugin
const sass 			= require('gulp-sass');
// Other requires
const plumber 		= require('gulp-plumber');
const notify 		= require('gulp-notify');
const browserSync 	= require('browser-sync');
const autoprefixer 	= require('gulp-autoprefixer');
const sassdoc 		= require('sassdoc');
const sourcemaps 	= require('gulp-sourcemaps');
const bower 		= require('gulp-bower');
const eslint 		= require('gulp-eslint');
const concat 		= require('gulp-concat');
const postcss     	= require('gulp-postcss');
const reporter    	= require('postcss-reporter');
const syntax_scss 	= require('postcss-scss');
const stylelint   	= require('stylelint');

// Path Variables

const devPath = './app';

var paths = {	
	bowerPath 	: 	'./bower_components',
	fontsPath 	:	devPath + '/fonts',
	scssPath 	: 	devPath + '/scss',
	cssPath 	: 	devPath	+ '/css',
	images		:	devPath + '/images',
	jsDir 		: 	devPath + '/js'
};



// Stylelint config objects

// Stylelint config rules
var stylelintConfig = {
	"extends": "stylelint-config-standard",
    "rules": {
		"indentation" : "tab",
		"unit-no-unknown" : [ true, {
          "ignoreUnits": [ "+em", "+rem" ]
		}],
		"selector-pseudo-class-no-unknown" : [ true, {
          "ignorePseudoClasses": [ "checked" ]
		}],
    }
}

var processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true
    })
];


// Functions

// Error Handler
function customPlumber(errorTitle){
	return plumber({
		errorHandler : notify.onError({
			title: errorTitle || "Error running Gulp",
			message: "Error: <%= error.message %>", 
		})
	});
};

// Tasks

// $ gulp bower

gulp.task('bower', function() {
    return bower()
		.pipe(gulp.dest(bowerPath))
});

// browser-sync task to use in gulp watch

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		}
	});
});


// Sass Options
// includePaths to allow direct @import

var sassOption = {
	//outputStyle: 'compressed',
        includePaths: [
		paths.bowerPath + '/breakpoint-sass/stylesheets',	
		paths.bowerPath + '/font-awesome-sass/assets/stylesheets',
		paths.bowerPath + '/susy/sass',
	]
};


// Sass task

gulp.task('sass', function(){
	return gulp.src(paths.scssPath + '/**/*.scss')
		.pipe(customPlumber('Error Running Sass'))
//		.pipe(sourcemaps.init())
		.pipe(postcss(processors, {syntax: syntax_scss}))
		.pipe(sass(sassOption))
		.pipe(autoprefixer())
//	  	.pipe(sourcemaps.write('maps/'))
		.pipe(gulp.dest(paths.cssPath))
		// Tells Browser Sync to reload files task is done
		.pipe(browserSync.reload({
			stream: true
		}))
});


// SCSS Lint Task


// ESLint task
// TODO: enable more custom configurations throw the .eslintrc config file

gulp.task('eslint', function(){
	return gulp.src(paths.jsDir + '/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});


// JS build task
// TODO: understand better logic

gulp.task('build-app', function(){
	return gulp.src(paths.jsDir + '/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.jsDir))
});

// Watch taks

gulp.task('watch', ['browserSync', 'eslint', 'build-app', 'sass'], function(){
	gulp.watch(paths.scssPath + '/**/*.scss', ['sass']);
	gulp.watch(paths.jsDir + '/**/*.js', ['eslint']);
});




// TODO: Sass Doc. task - This is just an example
gulp.task('sassdoc', function () {
  return gulp
    .src(paths.scssPath + '/**/*.scss')
    .pipe(sassdoc())
    .resume();
});


// TODO: Production task - This is just an example
gulp.task('prod', ['sassdoc'], function () {
  return gulp
    .src(paths.scssPath + '/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('app/css'));
});


// TODO: Add optimization tasks


