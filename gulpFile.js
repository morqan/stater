'use strict'

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

function cssProcessing(callback){
    
    gulp.src('./development/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole:true,
        outputStyle: 'compressed'
    }))
    .on('error',console.error.bind(console))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prodaction/css/'))
    callback();
}

gulp.task(cssProcessing);

gulp.task('default', gulp.series(cssProcessing,whach))