'use strict'

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
 
function cssProcessing(callback){
    
    gulp.src('./sass/main.scss')
    .pipe(sass({
        errorLogToConsole:true
    }))
    .on('error',console.error.bind(console))
    .pipe(rename({suffix: '.min'}))

    callback();
}

gulp.task(cssProcessing);