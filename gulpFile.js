'use strict'

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
// const minify = require('gulp-minify');
const minifyCSS = require('gulp-minify-css');
const browserSync = require('browser-sync').create();

function cssProcessing(callback){
    
    gulp.src('./development/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole:true,
        // outputStyle: 'compressed'
    }))
    .on('error',console.error.bind(console))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('./prodaction/css/'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prodaction/css/'))
    .pipe(browserSync.stream());
     
    callback();
}

gulp.task(cssProcessing);

function liveServer(callback) {
    browserSync.init({
        server: {
            baseDir:"./prodaction"
        },
        port: 3000
    });
    callback();
}



function watchProcessing(){
    gulp.watch("./development/sass/**/*",cssProcessing);
}


gulp.task('default', gulp.series(cssProcessing,watchProcessing));

gulp.task(liveServer);